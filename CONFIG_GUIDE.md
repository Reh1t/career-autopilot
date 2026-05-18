# Career Autopilot: Configuration Guide

To make the unified system work, you need to set up credentials in three different places. Since we copied these to a new folder, the original `.env` files (if they were gitignored) were likely not moved.

---

## 1. The Scraper Service (`/scraper/.env`)
This service uses Scrapegraph-ai to read job descriptions from URLs.

**Path:** `career-autopilot/scraper/.env`
**Required Values:**
```bash
# Required to use LLMs to extract data from websites
GEMINI_API_KEY=your_google_ai_studio_key_here

# Optional: If you prefer OpenAI
# OPENAI_API_KEY=your_openai_key_here
```

---

## 2. The Engine API (`/engine/.env`)
This service runs the evaluation logic (A-F scoring) and CV tailoring.

**Path:** `career-autopilot/engine/.env`
**Required Values:**
```bash
PORT=3001
GEMINI_API_KEY=your_google_ai_studio_key_here
GEMINI_MODEL=gemini-2.5-flash
```

---

## 3. The Web Dashboard (`/web/.env.local`)
This is the Next.js frontend. It needs to know where to find the other two services.

**Path:** `career-autopilot/web/.env.local`
**Required Values:**
```bash
# Supabase (You can use these placeholders for now to prevent crashes)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Service URLs (Used by the Dashboard to talk to the Backend)
# These are the default ports I set up in the code
NEXT_PUBLIC_SCRAPER_URL=http://localhost:8000
NEXT_PUBLIC_ENGINE_URL=http://localhost:3001
```

---

## 4. User Profile (`/engine/cv.md` and `/engine/config/profile.yml`)
The "Intelligence" comes from comparing a job to **YOU**. Make sure these two files in the engine folder are updated:

1.  **`career-autopilot/engine/cv.md`**: Paste your full resume here in Markdown.
2.  **`career-autopilot/engine/config/profile.yml`**: Ensure your name, target roles, and salary preferences are correct here.

---

## How to Verify
1.  **Scraper:** Visit `http://localhost:8000/docs`. You should see the FastAPI swagger UI.
2.  **Engine:** Visit `http://localhost:3001`. (It won't show a page, but it shouldn't be "Not Found").
3.  **Dashboard:** Go to `http://localhost:3000/dashboard`. 
    *   Paste this URL to test: `https://boards.greenhouse.io/anthropic/jobs/4023135007`
    *   Click "Evaluate".
