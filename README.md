# AutoApplier / Career Autopilot SaaS Ecosystem

> 🚧 **V2 Architecture Migration (In Progress)** 🚧
> *Currently migrating from synchronous REST APIs to an Asynchronous Event-Driven Architecture utilizing Redis and Celery message queues, and implementing DSPy for programmatic prompt optimization.*

AutoApplier is a distributed microservices SaaS designed to automate the entire job application lifecycle. It combines a Next.js front-end dashboard, a Python/FastAPI data extraction layer, and an Express LLM evaluation engine.

## Architecture

- **Frontend (`web/` & `AutoApplier/`)**: Next.js App Router applications implementing complex UX patterns and real-time state management.
- **Scraper (`scraper/`)**: A FastAPI microservice leveraging `ScrapeGraphAI` and LangChain to intelligently parse job boards and ATS platforms (Greenhouse, Lever).
- **Engine (`engine/`)**: A custom Node.js/Express evaluation and tailoring engine that dynamically routes LLM requests (Gemini, Groq, OpenRouter) to bypass rate limits and minimize token costs.
- **Extension (`extension/`)**: A Manifest V3 Chrome Extension to seamlessly autofill structured ATS forms.
