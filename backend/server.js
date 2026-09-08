require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const app = express()
const PORT = process.env.PORT || 3001

const ALLOWED_LANGUAGES = ['Python', 'JavaScript', 'C++']
const MAX_CODE_LENGTH = 20000
const MAX_ERROR_LENGTH = 2000

// ── Middleware ──────────────────────────────────────────────────────────────

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// ── Gemini client ────────────────────────────────────────────────────────────

let genAI = null

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

const SYSTEM_INSTRUCTION = `You are BugPilot, a concise AI debugging assistant for Python, JavaScript, and C++.
Analyze the provided programming language, error message, and code.
Identify the most likely root cause using only the supplied information.
Explain the problem in simple language.
Suggest a practical fix.
Return corrected code when a correction is possible.
Do not invent APIs, variables, runtime behavior, or errors that are unsupported by the input.
If the input is insufficient to determine the exact cause, clearly state that the diagnosis is probable rather than certain.
Keep the answer focused on the supplied code and error.
Always respond with valid JSON only — no markdown, no code fences, no extra text.`

const CANDIDATE_MODELS = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.5-flash']

async function analyzeWithGemini(language, error, code) {
  const client = getGenAI()
  const prompt = `Language: ${language}
Error: ${error}
Code:
${code}

Respond with JSON in exactly this shape:
{
  "rootCause": "...",
  "explanation": "...",
  "suggestedFix": "...",
  "fixedCode": "..."
}`

  let lastError = null
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      })

      const response = await model.generateContent(prompt)
      const text = response.response.text()

      // Strip possible markdown fences defensively
      const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      const parsed = JSON.parse(cleaned)

      // Validate expected fields exist
      const required = ['rootCause', 'explanation', 'suggestedFix', 'fixedCode']
      for (const field of required) {
        if (typeof parsed[field] !== 'string') {
          throw new Error(`Missing or invalid field: ${field}`)
        }
      }

      return parsed
    } catch (err) {
      console.warn(`Model ${modelName} encountered: ${err.message}. Trying next candidate...`)
      lastError = err
    }
  }

  throw lastError
}

// ── Routes ───────────────────────────────────────────────────────────────────

const { getDemoFallbackResult } = require('./demoFallback')

// Health check
app.get('/api/health', (req, res) => {
  const isKeySet = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here')
  res.json({
    status: 'ok',
    service: 'BugPilot AI',
    mode: isKeySet ? 'live' : 'demo',
    geminiConfigured: isKeySet,
  })
})

// Main debug endpoint
app.post('/api/debug', async (req, res) => {
  const { language, error, code } = req.body ?? {}

  // Validation
  if (!language || !error || !code) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: language, error, and code are all required.',
    })
  }

  if (!ALLOWED_LANGUAGES.includes(language)) {
    return res.status(400).json({
      success: false,
      error: `Unsupported language. Choose one of: ${ALLOWED_LANGUAGES.join(', ')}.`,
    })
  }

  if (typeof error !== 'string' || error.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Error message must be a non-empty string.' })
  }

  if (typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Code must be a non-empty string.' })
  }

  if (error.length > MAX_ERROR_LENGTH) {
    return res.status(400).json({ success: false, error: 'Error message is too long (max 2000 characters).' })
  }

  if (code.length > MAX_CODE_LENGTH) {
    return res.status(400).json({ success: false, error: 'Code is too long (max 20000 characters).' })
  }

  const isKeySet = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here')

  if (isKeySet) {
    try {
      const result = await analyzeWithGemini(language, error.trim(), code.trim())
      return res.json({ success: true, result, mode: 'live' })
    } catch (err) {
      console.error('Gemini error:', err.message)
      // If Gemini live call fails, gracefully fallback to demo result rather than failing hard
      const fallback = getDemoFallbackResult(language, error.trim(), code.trim())
      return res.json({ success: true, result: fallback, mode: 'fallback', note: 'Live API temporarily unavailable, using fallback analysis.' })
    }
  }

  // Demo fallback mode
  const result = getDemoFallbackResult(language, error.trim(), code.trim())
  return res.json({ success: true, result, mode: 'demo' })
})

// ── Start ─────────────────────────────────────────────────────────────────────

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    const isKeySet = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here')
    console.log(`BugPilot API running on http://localhost:${PORT}`)
    console.log(`Health: http://localhost:${PORT}/api/health`)
    if (!isKeySet) {
      console.log('Mode: DEMO MODE active (GEMINI_API_KEY is not set in .env). Built-in examples are fully functional.')
    } else {
      console.log('Mode: LIVE AI active with Gemini API.')
    }
  })
}

module.exports = app
