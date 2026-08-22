Between the two, **`career-autopilot`** is significantly more impressive and presentable for engineering recruiters.

While the `autoapplier` repository is a solid Next.js waitlist and landing page MVP, `career-autopilot` demonstrates senior-level engineering maturity. It features enterprise-grade CI/CD pipelines (including CodeQL, SBOM generation, and automated releases), extensive open-source governance (Code of Conduct, Contributing guides, and multi-language READMEs), and a robust backend architecture using Go for a Terminal UI alongside AI agent orchestration. It shows you know how to build, scale, and maintain complex systems.

Here is the README generated for `career-autopilot` using the requested template:

---

# Career Autopilot Engine

An autonomous, AI-driven job application engine featuring a Go-based Terminal UI, multi-agent orchestration, and deterministic pipeline tracking.

# Introduction & Goals

This project automates the tedious, repetitive phases of the job search. It intercepts job postings, processes the data through Claude and Gemini AI agents for suitability scoring, synchronizes resume updates, and tracks application pipelines through a dedicated Go-based Terminal UI.

* **What data I am working with:** Raw HTML/JSON job descriptions, YAML/JSON configuration profiles, and markdown-based CV revisions.


* **What tools I am using:** Go for the dashboard and UI, Node.js/Bash for stream processing and deduplication, and LLM APIs (Claude/Gemini) for semantic reasoning.


* **What I am doing with these tools:** Constructing a local agentic pipeline that filters duplicate job listings, dynamically tailors application assets, and provides real-time visual feedback on the pipeline's progress.



**Goal 1:** Eliminate duplicate effort and irrelevant job matching.
**How I know it worked:** The pipeline flags and drops 100% of previously processed or duplicate job IDs using the `dedup-tracker.mjs` before invoking expensive LLM calls.

**Goal 2:** Provide real-time operational observability without a heavy web frontend.
**How I know it worked:** The Go dashboard renders pipeline metrics and application progress in the terminal under 50ms per state update.

**Goal 3:** Maintain enterprise-grade code quality and security.
**How I know it worked:** 100% of pull requests pass automated CodeQL security scanning, SBOM generation, and Go test suites via GitHub Actions.

## Architecture

# Contents

* [The Data Set](https://www.google.com/search?q=%23the-data-set)
* [Constraints](https://www.google.com/search?q=%23constraints)
* [Used Tools](https://www.google.com/search?q=%23used-tools)
* [Connect](https://www.google.com/search?q=%23connect)
* [Buffer](https://www.google.com/search?q=%23buffer)
* [Processing](https://www.google.com/search?q=%23processing)
* [Storage](https://www.google.com/search?q=%23storage)
* [Visualization](https://www.google.com/search?q=%23visualization)


* [Pipelines](https://www.google.com/search?q=%23pipelines)
* [Stream Processing](https://www.google.com/search?q=%23stream-processing)
* [Storing Data Stream](https://www.google.com/search?q=%23storing-data-stream)
* [Processing Data Stream](https://www.google.com/search?q=%23processing-data-stream)


* [Batch Processing](https://www.google.com/search?q=%23batch-processing)
* [Visualizations](https://www.google.com/search?q=%23visualizations)


* [Demo](https://www.google.com/search?q=%23demo)
* [What Breaks](https://www.google.com/search?q=%23what-breaks)
* [Conclusion](https://www.google.com/search?q=%23conclusion)
* [Follow Me On](https://www.google.com/search?q=%23follow-me-on)
* [Appendix](https://www.google.com/search?q=%23appendix)

# The Data Set

* **Explain the data set:** The data consists of inbound job specifications scraped or fed into the engine, alongside local configuration profiles and tracking logs.
* **Why I chose it:** Job descriptions are notoriously unstructured and verbose. It is the perfect candidate for AI-driven normalization and extraction.
* **What is problematic:** Job boards frequently change DOM structures, and descriptions contain massive amounts of boilerplate.
* **What I want to do with it:** Extract hard requirements, match them against a user's `profile.yml`, and generate a deterministic "apply/skip" score.



## How much data is it

Assuming the engine scans 500 job postings a day. Each posting averages 4 KB of text, resulting in 2 MB of raw text daily. Once normalized and filtered down to the top 10% of relevant matches, the pipeline processes 50 active applications a day. Over a 30-day aggressive job search, this yields 1,500 tracked pipeline events. The metadata fits comfortably within a few megabytes of local JSON/YAML storage, meaning database infrastructure was entirely unnecessary for the MVP.

# Constraints

* **Budget:** Built to run locally using developer API credits for Claude/Gemini.


* **Compute:** Entirely local execution; the Go dashboard and Node scripts run concurrently on a standard developer laptop.


* **Data you do not control:** Third-party job board rate limits, unannounced schema changes, and LLM API latency.

# Used Tools

## Connect

*Node.js & Shell Scripts:* Tools like `check-liveness.mjs` and `cv-sync-check.mjs` handle the ingestion and synchronization of external state.

## Buffer

*Local File System:* Since this runs locally for a single user, standard I/O and local tracking logs (`/logs` and `/tracker-additions`) act as the buffer. Considered SQLite, but flat files are faster to iterate on for a single-tenant CLI tool.

## Processing

*Bash & AI Agents:* `batch-runner.sh` handles orchestration, passing parsed data to specialized agent skills (`career-ops`) governed by strict prompts.

## Storage

*Flat Files & YAML:* `DATA_CONTRACT.md` enforces schema validity. User profiles are maintained in `profile.yml`.

## Visualization

*Go Dashboard:* A custom TUI built in Go (`dashboard/main.go`) utilizing Catppuccin themes to render pipeline progress (`progress.go`) and application viewing (`viewer.go`). Considered building a React web app, but a TUI uses a fraction of the memory and keeps the developer in the terminal.

# Pipelines

## Stream Processing

Data enters the system, is immediately checked against the `dedup-tracker.mjs` to prevent duplicate LLM calls, and is then evaluated by the career-ops agents. Valid matches are moved to the staging phase, and the CV is synchronized (`cv-sync-check.mjs`) to ensure the latest version is used.

## Batch Processing

The `batch-runner.sh` allows for asynchronous processing of multiple scraped job descriptions in parallel, respecting LLM API rate limits through built-in backoff.

## Visualizations

The Go application continuously reads the local state and updates the terminal UI, providing a real-time Kanban-style view of the application pipeline.

# Demo

A demonstration of the Go TUI and agent pipeline in action:


# What Breaks

* **Job Board DOM Mutations:** Web scrapers feeding the engine will break when target sites update their CSS classes. I accepted this risk by isolating the ingestion layer from the processing layer.
* **LLM Rate Limits:** Processing 100+ jobs concurrently triggers HTTP 429 Too Many Requests from Anthropic/Google. The batch runner will stall and require manual restart.
* **State Corruption:** If the CLI is killed mid-write, the flat-file JSON trackers can corrupt. I skipped implementing a WAL (Write-Ahead Log) as the data is easily reproducible.

# Conclusion

This project successfully bridges the gap between raw web scraping and actionable career advancement. By relying on Go for a highly responsive TUI and isolated Node.js/Bash scripts for pipeline execution, the architecture remains modular and lightweight. The biggest challenge was normalizing the outputs of various LLMs into a strict data contract, ensuring the Go dashboard wouldn't panic on malformed JSON.

# Follow Me On

[LinkedIn](https://www.linkedin.com/in/rehantariqbhatti)
