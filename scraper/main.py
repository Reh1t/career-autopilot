from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scrapegraphai.graphs import SmartScraperGraph
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
import os
import traceback
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str
    prompt: str = "Extract the job description."

from typing import Optional, List
from pydantic import BaseModel, Field

class JobSchema(BaseModel):
    job_description: str = Field(description="The full text of the job description")
    company_name: str = Field(description="The name of the company")
    job_title: str = Field(description="The title of the job")
    salary: Optional[str] = Field(description="The salary or salary range if available")

@app.post("/scrape")
def scrape_job(request: ScrapeRequest):
    print(f"Scraping URL: {request.url}")
    
    try:
        llm_instance = None
        
        # Prioritize Gemini for scraping as it has higher free-tier limits
        if os.getenv("GEMINI_API_KEY"):
            print("Using Gemini Instance")
            # If LLM_MODEL starts with 'gemini', use it, otherwise default to 2.5-flash
            model_name = os.getenv("LLM_MODEL")
            if not model_name or not model_name.startswith("gemini"):
                model_name = "gemini-2.5-flash"
            
            llm_instance = ChatGoogleGenerativeAI(
                api_key=os.getenv("GEMINI_API_KEY"),
                model=model_name,
                temperature=0.0
            )
        elif os.getenv("OPENROUTER_API_KEY") or os.getenv("OPEN_ROUTER_API_KEY"):
            print("Using OpenRouter Instance")
            model_name = os.getenv("LLM_MODEL") or "google/gemini-2.0-flash-001"
            llm_instance = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY") or os.getenv("OPEN_ROUTER_API_KEY"),
                model=model_name,
                base_url="https://openrouter.ai/api/v1",
                temperature=0.0
            )
        elif os.getenv("GROQ_API_KEY"):
            print("Using Groq Instance")
            model_name = os.getenv("LLM_MODEL") or "llama-3.3-70b-versatile"
            llm_instance = ChatOpenAI(
                api_key=os.getenv("GROQ_API_KEY"),
                model=model_name,
                base_url="https://api.groq.com/openai/v1",
                temperature=0.0
            )
        elif os.getenv("OPENAI_API_KEY"):
            print("Using OpenAI Instance")
            model_name = os.getenv("LLM_MODEL") or "gpt-4o-mini"
            llm_instance = ChatOpenAI(
                api_key=os.getenv("OPENAI_API_KEY"),
                model=model_name,
                temperature=0.0
            )
        else:
            raise HTTPException(status_code=500, detail="No LLM API Key configured in .env")

        graph_config = {
            "llm": {
                "model_instance": llm_instance,
                "model_tokens": 128000, # Safe to use with model_instance
            },
            "model_tokens": 128000, # Also needed here for Scrapegraph-ai internal chunking
            "loader_kwargs": {
                "load_state": "networkidle",
                "requires_js_support": True,
            },
            "verbose": True,
            "headless": True,
            "timeout": 300, # Increased timeout for slow pages
            "reasoning": False,
            "reattempt": False, # Disabled due to bug in scrapegraphai 2.1.1 handling ConditionalNode edges
            "force": True,
            "cut": False,
        }

        # SmartScraperGraph is the most reliable for direct URLs
        smart_scraper_graph = SmartScraperGraph(
            prompt="Extract the full job description text, the company name, the job title, and salary if available. Ignore navigation and footers.",
            source=request.url,
            schema=JobSchema,
            config=graph_config
        )
        
        result = smart_scraper_graph.run()
        return result
    except Exception as e:
        print("--- SCRAPER ERROR TRACEBACK ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
