// Full production-ready Express server for AI Resume Enhancer

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const path = require('path');

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- Middleware ---
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(express.json({ limit: '5mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
}));

// --- Health Check ---
app.get('/health', (req, res) => {
  res.status(200).send('✅ Server Healthy');
});

// --- Helper Function ---
const callGeminiAPI = async (prompt, apiKey, isJson = false) => {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const generationConfig = isJson ? { "response_mime_type": "application/json" } : {};
  const payload = { contents: [{ parts: [{ text: prompt }] }], generationConfig };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Gemini API Error:', errorData);
    throw new Error(`Gemini API responded with status: ${response.status}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
};

// --- API Endpoints ---
app.post('/api/ai/enhance-resume', async (req, res) => {
  const { resumeText } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!resumeText || typeof resumeText !== 'string' || resumeText.length < 50 || resumeText.length > 5000 || !apiKey) {
    return res.status(400).json({ error: 'Invalid resume text or missing API key.' });
  }

  const prompt = `
    You are an expert ATS (Applicant Tracking System) optimization specialist. Your task is to analyze raw resume text and transform it into a single, valid JSON object with two top-level keys: "original" and "enhanced".

    ### OUTPUT FORMAT (MUST be followed exactly):
    {
      "original": {
        "contact": { "name": "", "email": "", "phone": "", "linkedin": "", "title": "" },
        "summary": "",
        "experience": [ { "jobTitle": "", "company": "", "dates": "", "description": "" } ],
        "projects": [ { "name": "", "description": "", "link": "" } ],
        "education": [ { "degree": "", "school": "", "dates": "" } ],
        "skills": ""
      },
      "enhanced": {
        "contact": { "name": "", "email": "", "phone": "", "linkedin": "", "title": "" },
        "summary": "...",
        "experience": [ ... ],
        "projects": [ ... ],
        "education": [ ... ],
        "skills": "..."
      }
    }

    ### RULES:
    1.  **ALWAYS** include all keys shown in the format, even if their value is an empty string "" or an empty array [].
    2.  For the "original" key, just parse the text cleanly. Do NOT enhance it.
    3.  For the "enhanced" key, ENHANCE ONLY the 'summary', 'experience.description', and 'projects.description' fields. Use strong action verbs and quantifiable results.
    4.  **CRITICAL**: If the raw text has "Projects" but NO "Work Experience", the "experience" array in BOTH "original" and "enhanced" MUST be an EMPTY array ([]). Do not mistake projects for work experience.
    5.  The final output must be a single, clean, minified, valid JSON object.

    ---
    Raw Resume Text:
    ---
    ${resumeText}
    ---
  `;

  try {
    const jsonString = await callGeminiAPI(prompt, apiKey, true);
    const result = JSON.parse(jsonString);
    res.json({ originalResume: result.original, enhancedResume: result.enhanced });
  } catch (error) {
    console.error("Error enhancing resume:", error);
    res.status(500).json({ error: 'Failed to enhance the resume.' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});
