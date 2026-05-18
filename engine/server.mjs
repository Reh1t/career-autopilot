import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import multer from 'multer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));

const PATHS = {
  shared: join(__dirname, 'modes', '_shared.md'),
  oferta: join(__dirname, 'modes', 'oferta.md'),
  cv: join(__dirname, 'cv.md'),
  profile: join(__dirname, 'modes', '_profile.md'),
  profileYml: join(__dirname, 'config', 'profile.yml'),
};

function readFile(path, label) {
  if (!existsSync(path)) return `[${label} not found]`;
  return readFileSync(path, 'utf-8').trim();
}

// --- PROFILE ENDPOINTS ---

app.get('/profile', (req, res) => {
  try {
    const cv = readFile(PATHS.cv, 'cv.md');
    const profileYml = readFile(PATHS.profileYml, 'config/profile.yml');
    console.log('Profile requested and found');
    res.json({ cv, profileYml });
  } catch (error) {
    console.error('Error in /profile:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/profile', (req, res) => {
  const { cv, profileYml } = req.body;
  if (cv) writeFileSync(PATHS.cv, cv);
  if (profileYml) writeFileSync(PATHS.profileYml, profileYml);
  res.json({ success: true });
});

app.post('/profile/upload-cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const data = await pdf(req.file.buffer);
    const text = data.text;

    // Use LLM to clean up the PDF text and format as Markdown
    let apiKey, baseURL, modelName;
    if (process.env.GEMINI_API_KEY && (process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY)) {
       apiKey = process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
       baseURL = "https://openrouter.ai/api/v1";
       modelName = "google/gemini-2.0-flash-001";
    } else {
       apiKey = process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
       baseURL = (process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY) ? "https://openrouter.ai/api/v1" : (process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1" : undefined);
       modelName = process.env.LLM_MODEL || (process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o-mini");
    }
    
    const openai = new OpenAI({ apiKey, baseURL });
    
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "You are a CV expert. Convert the following raw text from a PDF resume into a clean, well-structured Markdown document. Preserve all experience, education, and skills." },
        { role: "user", content: text }
      ]
    });

    const markdownCV = response.choices[0].message.content;
    
    // Step 2: Extract Profile Info into YAML
    const profileResponse = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: `Extract the candidate's personal info from the resume and format it as a YAML object. 
Include these fields: name, email, phone, location, timezone. 
Also add placeholder fields for: target_roles (list), salary_target (min, max, currency), and remote_preference (true/false).
Output ONLY the raw YAML code block.` },
        { role: "user", content: markdownCV }
      ]
    });

    let profileYml = profileResponse.choices[0].message.content;
    // Clean up markdown code blocks if the LLM included them
    profileYml = profileYml.replace(/```yaml|```/g, '').trim();

    writeFileSync(PATHS.cv, markdownCV);
    writeFileSync(PATHS.profileYml, profileYml);
    
    res.json({ success: true, markdown: markdownCV, profileYml: profileYml });
  } catch (error) {
    console.error('Error processing CV:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- EVALUATION ENDPOINT ---

app.post('/evaluate', async (req, res) => {
  const { jdText } = req.body;
  
  let apiKey, baseURL, modelName;

  // Prioritize Gemini for higher free-tier limits
  if (process.env.GEMINI_API_KEY) {
    apiKey = process.env.GEMINI_API_KEY;
    // Note: Gemini via OpenAI protocol usually requires a specific base URL 
    // but here we are using the OpenAI SDK. For native Gemini, we'd need another lib.
    // However, if the user has OpenRouter, it's safer to use that for Gemini.
    // Let's check for OpenRouter first if they want Gemini but only have OpenAI SDK.
    if (process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY) {
       apiKey = process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
       baseURL = "https://openrouter.ai/api/v1";
       modelName = process.env.LLM_MODEL && process.env.LLM_MODEL.includes("/") 
                   ? process.env.LLM_MODEL 
                   : "google/gemini-2.0-flash-001";
    } else {
       // Fallback to Groq or OpenAI if no OpenRouter but they have those keys
       apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
       baseURL = process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1" : undefined;
       modelName = process.env.LLM_MODEL || (process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o-mini");
    }
  } else {
    apiKey = process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    baseURL = (process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY) 
              ? "https://openrouter.ai/api/v1" 
              : (process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1" : undefined);
    modelName = process.env.LLM_MODEL || "gpt-4o-mini";
  }

  if (!jdText) return res.status(400).json({ error: 'Job description is required' });
  if (!apiKey) return res.status(500).json({ error: 'LLM API Key is not configured' });

  console.log(`Evaluating using model: ${modelName} via ${baseURL || 'OpenAI'}`);

  const openai = new OpenAI({ apiKey, baseURL });

  const sharedContext = readFile(PATHS.shared, 'modes/_shared.md');
  const ofertaLogic = readFile(PATHS.oferta, 'modes/oferta.md');
  const cvContent = readFile(PATHS.cv, 'cv.md');
  const profileContent = readFile(PATHS.profile, 'modes/_profile.md');
  const profileYml = readFile(PATHS.profileYml, 'config/profile.yml');

  const systemPrompt = `You are career-ops, an AI-powered job search assistant.
Evaluate job offers using the structured A-G scoring system below.

Your output MUST follow this exact structure:
1. The Markdown report (Blocks A-G)
2. The summary block at the very end.

CRITICAL RULES:
- BE CONCISE. Use bullet points and tables. Avoid long paragraphs.
- DO NOT include any preamble or introductory text (e.g., "Okay, I'll evaluate...").
- DO NOT wrap the entire Markdown report in triple backticks.
- Start IMMEDIATELY with the # Evaluation header.

${sharedContext}
${ofertaLogic}

CANDIDATE DATA:
CV: ${cvContent}
PROFILE: ${profileYml}
NARRATIVE: ${profileContent}

IMPORTANT: At the end, output this summary block:
---SCORE_SUMMARY---
COMPANY: <company>
ROLE: <role>
SCORE: <score>
ARCHETYPE: <archetype>
LEGITIMACY: <legitimacy>
---END_SUMMARY---`;

  try {
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `JD TO EVALUATE: ${jdText}` }
      ],
      temperature: 0.7,
    });

    let evaluationText = response.choices[0].message.content.trim();

    // --- CLEANING LOGIC ---
    // 1. Remove LLM conversational filler if it leaked through
    evaluationText = evaluationText.replace(/^(Okay|Sure|I will|Let's).*?\n+/i, '');
    
    // 2. Remove entire report code block wrappers if the LLM ignored instructions
    evaluationText = evaluationText.replace(/^```(markdown|text|md)?\n([\s\S]*?)\n```$/i, '$2');

    // Robust Summary Extraction
    const summaryMatch = evaluationText.match(/---SCORE_SUMMARY---\s*([\s\S]*?)---END_SUMMARY---/);
    let summary = {};
    
    if (summaryMatch) {
      summaryMatch[1].split('\n').forEach(line => {
        const [key, ...val] = line.split(':');
        if (key && val.length) summary[key.trim().toLowerCase()] = val.join(':').trim();
      });
    } else {
      // Fallback: Try to extract from the top of the document
      const companyMatch = evaluationText.match(/# Evaluation:\s*([^-]+)\s*—/i);
      const roleMatch = evaluationText.match(/—\s*([^\n]+)/i);
      const scoreMatch = evaluationText.match(/\*\*Score:\*\*\s*([\d.]+)/i);
      const archetypeMatch = evaluationText.match(/\*\*Archetype:\*\*\s*([^\n]+)/i);
      const legitimacyMatch = evaluationText.match(/\*\*Legitimacy:\*\*\s*([^\n]+)/i);

      summary = {
        company: companyMatch ? companyMatch[1].trim() : 'Unknown',
        role: roleMatch ? roleMatch[1].trim() : 'Role',
        score: scoreMatch ? scoreMatch[1].trim() : '?',
        archetype: archetypeMatch ? archetypeMatch[1].trim() : 'Standard',
        legitimacy: legitimacyMatch ? legitimacyMatch[1].trim() : 'N/A'
      };
    }

    console.log('Extracted Summary:', summary);
    res.json({ evaluationText, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- TAILORING ENDPOINT ---

app.post('/tailor', async (req, res) => {
  const { jdText } = req.body;
  
  if (!jdText) return res.status(400).json({ error: 'Job description is required' });

  let apiKey, baseURL, modelName;
  if (process.env.GEMINI_API_KEY && (process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY)) {
     apiKey = process.env.OPEN_ROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
     baseURL = "https://openrouter.ai/api/v1";
     modelName = "google/gemini-2.0-flash-001";
  } else {
     apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
     baseURL = (process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY) ? "https://openrouter.ai/api/v1" : (process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1" : undefined);
     modelName = process.env.LLM_MODEL || (process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o-mini");
  }

  const cvContent = readFile(PATHS.cv, 'cv.md');
  const profileYml = readFile(PATHS.profileYml, 'config/profile.yml');

  const systemPrompt = `You are a career strategist. Create a highly targeted CV tailoring strategy.
  
CANDIDATE CV:
${cvContent}

TARGET JD:
${jdText}

OUTPUT FORMAT (Markdown):
1. **Summary Re-write**: A powerful 3-sentence summary for the top of the CV.
2. **Top 5 Bullet Point Adjustments**: Specific existing bullets to change and what to change them to.
3. **Keyword Optimization**: List 10 keywords from the JD to weave into the skills section.
4. **Project Focus**: Which 2 projects from the CV to emphasize and how to describe them to match this JD.

BE CONCISE. Use tables and bullets. No preambles.`;

  try {
    const openai = new OpenAI({ apiKey, baseURL });
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.7,
    });

    let tailoringText = response.choices[0].message.content.trim();
    tailoringText = tailoringText.replace(/^```(markdown|text|md)?\n([\s\S]*?)\n```$/i, '$2');
    
    res.json({ tailoringText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Engine API listening at http://localhost:${port}`);
});
