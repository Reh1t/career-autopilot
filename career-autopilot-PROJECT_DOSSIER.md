# PROJECT DOSSIER

## 1. Project Identity

- **Project Name:** AutoApplier / Career Autopilot SaaS Ecosystem
- **Repository Name:** career-autopilot
- **Repository Purpose:** A suite of microservices designed to automate job application evaluation and CV tailoring.
- **Current Apparent Status:** Local Prototype / Minimum Viable Product (MVP)
- **Primary Technologies:** TypeScript, Python, JavaScript, Go (embedded TUI tool)
- **Main Languages:** TypeScript (Frontend), Python (Scraper), JavaScript (Engine)
- **Relevant Frameworks/Libraries:** Next.js (React), FastAPI, Express, ScrapeGraphAI, LangChain, OpenAI SDK, Bubbletea (Go)
- **Approximate Project Scope:** ~4 main components, tying together UI, web scraping, and LLM text generation via API endpoints.

## 2. Executive Technical Summary

Career Autopilot is a multi-service prototype designed to analyze job postings and evaluate a candidate's fit. It comprises a Next.js frontend dashboard, a Python/FastAPI scraping service, and a Node.js/Express evaluation engine. 

The system operates entirely via synchronous REST API calls. A user provides a job URL in the Next.js frontend, which calls the Python scraper to extract the job description using `scrapegraphai`. The frontend then forwards the extracted text to the Node.js evaluation engine, which acts as an API wrapper around a set of Markdown-based prompt templates (derived from a CLI tool called `career-ops`). The engine concatenates the job description with a locally stored CV and profile, submits it to an LLM (configured via OpenRouter/Groq/OpenAI), and parses a requested Markdown structure to return a score and tailoring strategy.

## 3. Problem and Intended Use Case

- **Problem:** Tailoring CVs and evaluating personal fit for dozens of job descriptions is highly manual and time-consuming.
- **Intended Users/Use Case:** Job seekers who want an automated way to score their fit for a role and generate customized CV bullet points based on a job posting URL.
- **Expected Workflow:** User pastes a job URL -> System scrapes the text -> System compares job requirements against the user's local CV -> System provides an A-G match score and specific CV bullet point rewrites.
- **Demonstrated Use:** The core workflow is implemented and runnable locally. The Chrome Extension designed to autofill applications, however, is merely a mock and does not function end-to-end.

## 4. Architecture

The architecture is composed of independent, locally-run services communicating via HTTP:

- **Frontend (`web/`)**: Next.js App Router application providing a dashboard to input URLs and view markdown reports.
- **Scraper (`scraper/`)**: FastAPI microservice with a single `/scrape` endpoint. It leverages `scrapegraphai` (and LangChain) to navigate to a URL and extract a structured job description schema.
- **Engine (`engine/`)**: Node.js/Express API with `/evaluate`, `/tailor`, and `/profile` endpoints. It reads local markdown files (`cv.md`, `modes/_shared.md`, etc.) and acts as the orchestrator for LLM calls. Includes an embedded Go-based CLI dashboard (`dashboard/`) from a predecessor project.
- **Extension (`extension/`)**: A Manifest V3 Chrome Extension containing a popup UI and a hardcoded JavaScript payload to simulate form autofilling (currently mocked).

*Note: There are no queues, caches, or message brokers implemented in the repository, despite documentation claims.*

## 5. End-to-End System Flow

1. **Input:** User pastes a job URL into the Next.js dashboard (`web/src/app/dashboard/page.tsx`).
2. **Scraping:** Frontend sends a POST request to `localhost:8000/scrape`. The FastAPI app uses `SmartScraperGraph` to load the URL in a headless browser and uses an LLM to extract the `JobSchema` (Description, Company, Title).
3. **Evaluation Request:** Frontend sends the extracted text to `localhost:3001/evaluate`.
4. **Context Construction (Engine):** Express server (`engine/server.mjs`) reads the user's `cv.md`, `config/profile.yml`, and system prompt templates from the local disk.
5. **Model Invocation:** The Engine sends a massive concatenated prompt to the configured LLM using the OpenAI Node SDK.
6. **Structured Output & Validation:** The LLM is instructed to append a specific `---SCORE_SUMMARY---` block to the end of its response. The Engine uses Regular Expressions to parse this block. If the block is missing, a fallback regex attempts to scrape the score from standard markdown headers.
7. **Final Response:** The parsed score and full markdown report are sent back to Next.js and rendered using `react-markdown`.

## 6. AI / LLM Engineering

- **Models/Providers:** Supports OpenAI, OpenRouter, Groq, and Gemini natively via environmental variable fallbacks (`engine/server.mjs`, `scraper/main.py`). 
- **RAG / Embeddings / Retrieval:** **None.** The system relies entirely on "prompt stuffing" (in-context learning). The entire CV and job description are passed directly into the system prompt for every request. There is no chunking, vector database, or semantic retrieval implemented.
- **Tool Calling / Structured Outputs:** 
  - The Scraper uses `scrapegraphai` which handles structured extraction via Pydantic schemas (`JobSchema`).
  - The Engine does *not* use native LLM structured outputs (like OpenAI JSON mode). Instead, it uses prompt engineering to request a specific text block (`---SCORE_SUMMARY---`) and parses it using Regex.
- **Scraping Agent:** Uses `SmartScraperGraph` with `load_state="networkidle"` and `requires_js_support=True` via Playwright to handle client-side rendered job boards.

## 7. Engineering Decisions

### Decision: Splitting Scraper (Python) and Engine (Node.js)
- **Evidence:** `scraper/` is FastAPI, `engine/` is Express.
- **Tradeoff:** Enables using the best ecosystem for each task (Python for `scrapegraphai`/LangChain web scraping; Node.js to reuse existing `career-ops` JavaScript file-parsing logic). It introduces the complexity of running two separate local servers for a single workflow.

### Decision: File-System as Database for User Data
- **Evidence:** `engine/server.mjs` reads and writes directly to `engine/cv.md` and `engine/config/profile.yml`.
- **Tradeoff:** Extremely simple to build and test locally. However, it completely prevents multi-tenant SaaS deployment, as concurrent users would overwrite each other's local CV files.

### Decision: Regex-based Output Parsing over JSON Mode
- **Evidence:** Fallback regex logic in `engine/server.mjs` lines 210-233.
- **Tradeoff:** Allows the LLM to stream a readable markdown report first, appending the parseable data at the end. However, it is brittle and prone to breaking if the LLM hallucinating format changes.

## 8. Reliability and Failure Handling

- **Evaluation Parsing Fallback:** If the LLM fails to generate the `---SCORE_SUMMARY---` block, the engine implements a fallback regex to search for standard markdown headers (e.g., `**Score:**`).
- **Scraper Error Handling:** Wraps the scraping execution in a generic try-catch block and returns a 500 status code with the stringified exception. There are no automatic retries for failed scrapes or rate-limited API calls.
- **State Management:** Fully stateless API layer. State relies entirely on local file disk (CV) and Next.js React state (current evaluation).

## 9. Security

- **Authentication / Authorization:** None. The backend APIs (`/scrape`, `/evaluate`, `/tailor`) are open and unauthenticated.
- **Tenant Isolation:** None. A single `cv.md` file acts as the global state for the engine.
- **CORS:** The FastAPI scraper allows all origins (`allow_origins=["*"]`).
- **Data Privacy:** Personal data is sent directly to third-party LLMs (OpenAI, Groq, etc.). A custom script (`engine/test-all.mjs`) includes a rudimentary regex checker to ensure personal strings (e.g., specific names/emails) aren't accidentally committed to the repository, but the application itself has no data redaction layer.

## 10. Testing

- **Engine Tests:** `engine/test-all.mjs` is a custom Node script that acts as a test runner. It performs basic syntax checks (`node --check`), validates that necessary configuration markdown files exist, and runs shell commands to ensure scripts execute without crashing.
- **Go Tests:** The legacy embedded dashboard (`engine/dashboard/internal`) contains a few standard Go unit tests (`_test.go`).
- **Absence of Core Tests:** There are no unit or integration tests for the Next.js frontend, the FastAPI scraper, or the core Express API endpoints.

## 11. Evaluation

- **System Evaluation:** There is **no automated evaluation framework** (e.g., DSPy, prompt testing, accuracy benchmarks) in the repository to measure how well the AI extracts data or scores resumes. 
- The word "evaluate" in this project exclusively refers to the LLM evaluating a *candidate's resume*, not a developer evaluating the *software's performance*.

## 12. Observability

- **Logging:** Relies entirely on basic console standard output (`print()` in Python, `console.log()` in Node). 
- **Tracing/Metrics:** No OpenTelemetry, LangSmith, token tracking, or structured logging is implemented.

## 13. Performance

- **Not Verified:** No performance benchmarks, latency metrics, or optimization implementations are present in the repository. The architecture is synchronous HTTP requests chaining multiple LLM calls, which inherently implies high response latency (observable via the frontend loading spinners).

## 14. Data and Persistence

- **Primary Persistence:** Local file system (`cv.md`, `profile.yml`).
- **Database Schema:** A Prisma schema exists in `web/prisma/schema.prisma` with `Waitlist` and `ApplicationLog` tables. However, it is largely unused by the core application workflow. The frontend only queries a `_test_` table to determine DB connection status.

## 15. Deployment and Infrastructure

- **Status:** **Locally Runnable Only.**
- **Infrastructure:** The project lacks Dockerfiles, `docker-compose`, Terraform, or CI/CD pipelines (e.g., GitHub Actions). 
- To run the project, a developer must manually open three terminal tabs, install dependencies across three ecosystems (npm, pip), and start the servers locally (`npm run dev`, `uvicorn main:app`, `node server.mjs`).

## 16. External Integrations

- **ScrapeGraphAI / Playwright:** Used to scrape and parse complex SPA job boards.
- **LLM Providers:** OpenAI SDK used to route requests to OpenAI, Groq, and OpenRouter. Google Generative AI SDK is installed but routing logic heavily favors OpenAI/OpenRouter protocols.
- **Supabase:** Initialized in the frontend for connection testing only.

## 17. Repository Structure

- `/web`: Next.js App Router frontend dashboard.
- `/scraper`: Python FastAPI application handling `scrapegraphai` execution.
- `/engine`: Node.js Express API. Wraps the prompt logic, manages local CV files, and coordinates LLM evaluation requests. Contains legacy `career-ops` CLI files and a Go TUI in `/dashboard`.
- `/extension`: Mock Chrome extension with no active integration to the APIs.

## 18. Most Significant Engineering Problems Solved

- **Cross-Language Orchestration:** Successfully combining a Python ecosystem tool (ScrapeGraphAI, which excels at web scraping) with a Node.js text-processing engine (reusing existing prompt architectures) via local REST APIs.
- **LLM Output Structuring:** Engineering prompts that successfully force standard conversational LLMs to output structured, parsable data without strictly relying on provider-specific JSON modes.

## 19. Strongest Professional Evidence

### Product Engineering
Demonstrates the ability to rapidly prototype a multi-component product that solves a real user problem (job application tailoring). The Next.js frontend has a clean, functional UI mapping to the underlying APIs.

### Backend / Systems
Shows a basic understanding of microservice separation by delegating the scraping workload to a dedicated Python service.

## 20. Interview Talking Points

- **Architecture:** "I built the system using a microservices approach to leverage the best tools for each job—FastAPI and ScrapeGraphAI in Python for headless browser extraction, and a Node.js engine for resume text processing and LLM orchestration."
- **Prompt Engineering:** "Rather than relying strictly on JSON mode, I designed prompts that output readable markdown reports for the user while appending a parsable data block at the end, allowing for a fallback regex extraction."
- **Next Steps for Scale:** "To move this from a local prototype to a production SaaS, the first priority would be migrating from local file storage (cv.md) to a multi-tenant PostgreSQL database with user authentication, and converting the synchronous API chain into an asynchronous message queue."

## 21. Likely Interview Questions

- **Architecture:** Why did you choose to split the scraper and the engine into two different languages/services instead of using one monolith?
- **Scaling:** How would you handle the latency of sequential LLM calls as user traffic increases?
- **Data Modeling:** The current system uses local markdown files for CVs. Walk me through the database schema you would design to support thousands of users.
- **Reliability:** Web scrapers break often when target sites update. How would you monitor and handle failures in the scraping service?

## 22. Limitations and Known Gaps

- **Not Multi-Tenant:** The backend uses the local file system for state, meaning it can only support one user at a time.
- **Synchronous Bottlenecks:** The API calls block until the LLM finishes generating, which can lead to frontend timeouts.
- **Mock Extension:** The Chrome extension does not actually communicate with the Engine; it injects a hardcoded JSON payload.
- **Missing Deployment Infrastructure:** Cannot be deployed to the cloud in its current state without containerization and configuration work.

## 23. Claims That Must NOT Be Made

- ❌ **"V2 Architecture Migration to Async Event-Driven Architecture."** (The system is strictly synchronous REST APIs).
- ❌ **"Utilizes Redis and Celery message queues."** (These technologies are not present in the codebase).
- ❌ **"Implemented DSPy for programmatic prompt optimization."** (DSPy is not installed or used anywhere in the code).
- ❌ **"Production-ready" or "Deployed SaaS."** (It is a local prototype lacking multi-tenancy, auth, and deployment files).
- ❌ **"Automated Chrome Extension Autofill."** (The extension is a static UI with mock data injection).
- ❌ **"Uses RAG or Vector Databases."** (It relies entirely on prompt stuffing).

## 24. Verified Facts vs Documentation Claims

### Verified from Implementation
- Multi-service architecture across Python, Node, and Next.js.
- Functional job scraping using ScrapeGraphAI.
- Functional LLM evaluation using OpenAI SDK and prompt engineering.

### Claimed in Documentation but Not Fully Verified
- **V2 Migration (Redis, Celery, DSPy):** Explicitly claimed in the README ("Currently migrating from synchronous REST APIs to an Asynchronous Event-Driven Architecture utilizing Redis and Celery... and implementing DSPy"). **None of this code exists in the repository.**
- **Integration with Greenhouse/Lever:** Claimed in the README, but the scraper relies entirely on generic generic SmartScraperGraph logic without specific site adapters.
- **Database setup:** The frontend `.env.local` instructions mention Supabase, but the application logic does not actually persist application logs or users to it (only runs a `_test_` connection query).

## 25. Evidence Index

- API Orchestration: `web/src/app/dashboard/page.tsx` (Lines 62-115)
- Fallback Regex Parsing: `engine/server.mjs` (Lines 210-233)
- Scraper Implementation: `scraper/main.py` (Lines 104-113)
- Local File State: `engine/server.mjs` (Lines 37-54)
- Test Script: `engine/test-all.mjs`
- Mock Extension Logic: `extension/popup.js` (Lines 10-18)

## 26. Final Technical Assessment

This project demonstrates strong product engineering and rapid prototyping skills moderately well. It successfully strings together multiple modern AI developer tools (ScrapeGraphAI, Next.js, OpenAI SDK) to create a cohesive local tool for a real-world use case. 

However, it does not demonstrate production backend engineering, distributed systems reliability, or advanced AI architecture (RAG/Evals). To move toward real production use, the system fundamentally requires containerization (Docker), a multi-tenant database (replacing local file I/O), user authentication, and the actual implementation of the asynchronous message queues (Celery/Redis) that are currently only claimed in the documentation. 

The strongest engineering story this repository supports is that of an entrepreneurial developer who can quickly architect and build full-stack AI-integrated prototypes across multiple tech stacks.
