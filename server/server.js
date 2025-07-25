// Full production-ready Express server for AI Resume Enhancer + Zoho verification support

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Serve static files from 'public' (for Zoho)
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

// --- API Endpoint ---
app.post('/api/ai/enhance-resume', async (req, res) => {
  const { resumeText } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!resumeText || typeof resumeText !== 'string' || resumeText.length < 50 || resumeText.length > 5000 || !apiKey) {
    return res.status(400).json({ error: 'Invalid resume text or missing API key.' });
  }

  const prompt = `
    You are an expert ATS (Applicant Tracking System) optimization specialist...
    ${resumeText}
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
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
