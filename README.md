# Career Autopilot Engine

A local agentic job-processing pipeline combining deterministic job deduplication, LLM-based suitability analysis, application-state tracking, CV synchronization, and a lightweight Go terminal dashboard.

> **Project status:** Independent engineering project / local prototype. It automates a personal workflow and is not presented as a production SaaS platform.

## Problem

Job-search automation mixes deterministic work with probabilistic reasoning.

Some tasks should not require an LLM:

- duplicate detection
- local-state validation
- CV synchronization
- application tracking

Other tasks benefit from semantic reasoning:

- interpreting job requirements
- comparing requirements with a candidate profile
- deciding whether a position is worth pursuing

Career Autopilot separates those concerns.

## Architecture

```text
Job Sources
   |
   v
+---------------------+
| Ingestion / Parsing |
+----------+----------+
           |
           v
+---------------------+
| Deterministic       |
| Deduplication       |
+----------+----------+
           |
           v
+---------------------+        +--------------------+
| Candidate Profile   |        | Job Specification  |
| profile.yml         |        | normalized data    |
+----------+----------+        +---------+----------+
           |                             |
           +-------------+---------------+
                         |
                         v
              +----------------------+
              | Career-Ops AI Agents |
              | Claude / Gemini      |
              +----------+-----------+
                         |
                         v
              +----------------------+
              | Suitability /       |
              | Apply-or-Skip Logic |
              +----------+-----------+
                         |
                 +-------+-------+
                 |               |
                 v               v
               SKIP           STAGING
                                  |
                                  v
                          CV Synchronization
                                  |
                                  v
                          Application Tracker
                                  |
                                  v
                          Go Terminal UI
```

The Go TUI acts as an observability layer over the local pipeline rather than as part of the LLM reasoning path.

## Core workflow

1. Job descriptions enter the local pipeline.
2. Ingestion normalizes available job data.
3. `dedup-tracker.mjs` removes already-processed/duplicate job IDs before expensive model calls.
4. Candidate profile and job information are supplied to the career-ops agents.
5. Claude/Gemini-based agents perform semantic suitability analysis.
6. Relevant jobs move into the staging/application workflow.
7. CV synchronization checks ensure the current application asset is used.
8. Local state is exposed through the Go terminal dashboard.

## Deterministic before probabilistic

```text
                 JOB
                  |
                  v
        Deterministic checks
        /
   duplicate             new job
      |                     |
     DROP                   v
                   LLM semantic reasoning
                           |
                    +------+------+
                    |             |
                   SKIP          APPLY
                                  |
                                  v
                           deterministic
                           CV/state checks
```

Duplicate detection is deterministic and inexpensive, so the system avoids spending an LLM call on a decision ordinary program logic can make exactly.

## Agentic layer

The `career-ops` workflow performs semantic reasoning over job requirements and candidate information.

The surrounding pipeline remains deterministic where possible, so the AI layer does not become the source of truth for application state.

## Data contracts

The repository uses local YAML/JSON state and `DATA_CONTRACT.md` to define expected pipeline structures.

This matters because the Go dashboard and application-tracking scripts consume the AI pipeline's outputs. Model output is therefore treated as application data that must conform to a contract rather than arbitrary text passed directly downstream.

## Go terminal dashboard

The project uses Go for a lightweight terminal UI instead of another web frontend.

The dashboard:

- displays pipeline progress
- exposes application state
- renders a Kanban-style view
- consumes local pipeline state
- keeps the operational interface lightweight

The repository reports sub-50ms state-update rendering in its local environment. This is a prototype measurement, not a production performance guarantee.

## Engineering decisions

### Deduplicate before LLM calls

Duplicate detection is deterministic and inexpensive. Running the same job through an LLM multiple times wastes latency and API budget.

### Flat files for a single-user MVP

The system is local and single-user, so JSON/YAML files are sufficient for the current state-management requirements. A database becomes more useful for concurrency, transactional state, and larger history.

### Go TUI instead of a web dashboard

The dashboard is an operational interface for a developer workflow. A terminal UI avoids adding another application stack just for visualization.

### Separate AI reasoning from state management

The LLM can recommend an action, but deterministic scripts maintain the actual pipeline state.

## Failure modes and trade-offs

### Job-source changes

External job pages can change their DOM or data structures.

**Mitigation:** isolate ingestion from downstream processing.

### LLM rate limits

Parallel processing can hit provider rate limits.

**Mitigation:** the batch runner includes backoff behavior, but the local prototype does not claim a fully durable distributed job queue.

### Flat-file corruption

A process terminated during a write could corrupt local tracker state.

**Possible improvement:** SQLite or another transactional state store with durable writes.

### LLM output changes

Different providers can return semantically similar but structurally different outputs.

**Mitigation:** enforce a shared data contract before downstream components consume results.

## Validation and observability

The project emphasizes deterministic controls around the AI workflow:

- duplicate jobs are filtered before model calls
- pipeline state is tracked explicitly
- data contracts define expected structures
- Go provides a live operational view
- CI includes Go tests, CodeQL scanning, and SBOM generation

These are engineering controls around a local agentic workflow, not proof of production reliability.

## Production considerations

If expanded beyond a personal local tool, the main changes would include durable state storage, queue-based execution, distributed workers, provider fallback, structured evaluation of suitability decisions, monitored job-source adapters, application auditing, secret management, cost/token telemetry, multi-user isolation, and stronger failure recovery.

## What I learned

Agentic systems benefit from a **deterministic shell around probabilistic reasoning**.

The LLM is useful for interpreting ambiguous job requirements, but it should not be responsible for duplicate detection, application state, file synchronization, or the basic integrity of the pipeline.

## Current scope

Career Autopilot is best described as:

> **A local agentic job-processing and application workflow combining deterministic automation with LLM-based semantic reasoning and terminal observability.**

It is not presented as an autonomous production job-application service.

## Links

- GitHub: https://github.com/Reh1t/career-autopilot
- LinkedIn: https://www.linkedin.com/in/rehantariqbhatti
