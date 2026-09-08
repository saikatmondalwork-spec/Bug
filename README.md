# BugPilot AI

> AI-powered debugging assistant for Python, JavaScript, and C++

## Problem

Debugging is one of the most time-consuming parts of software development, especially for beginners. Decoding cryptic error messages and identifying root causes requires experience that novice developers simply don't have yet.

## Solution

BugPilot AI takes a language selection, an error message/stack trace, and the relevant code, then uses the Gemini AI model to return a structured debugging report: root cause, plain-English explanation, suggested fix, and corrected code — all in seconds.

## Features

- 🔍 AI-powered root cause analysis
- 💬 Plain-English explanation of the bug
- 🔧 Actionable suggested fix
- ✅ Corrected code with one-click copy
- 📚 6 built-in example bugs to demonstrate the tool
- 🌐 Responsive two-column layout (desktop) / stacked (mobile)
- ⚡ Fast — powered by Gemini 1.5 Flash

## Supported Languages

| Language   | Example bugs included |
|------------|----------------------|
| Python     | IndexError, NameError |
| JavaScript | TypeError (undefined property, array index) |
| C++        | Array out-of-bounds, uninitialized variable |

## Architecture

```
Browser (React + Vite)
    ↓  POST /api/debug  { language, error, code }
Express Backend (Node.js)
    ↓  Gemini 1.5 Flash API call
Google Gemini
    ↓  Structured JSON response
Express Backend
    ↓  { success, result: { rootCause, explanation, suggestedFix, fixedCode } }
Browser → renders result
```

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Monaco Editor
- **Backend:** Node.js, Express
- **AI:** Google Gemini 1.5 Flash via `@google/generative-ai`
- **Dev tooling:** IBM Bob (AI coding assistant)

## Local Setup

### Prerequisites

- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/) (free tier available)

### 1. Clone the repository

```bash
git clone <repo-url>
cd bugpilot-ai
```

### 2. Install dependencies

```bash
# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

### 3. Configure environment variables

```bash
cd backend
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
```

### 4. Run the application

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm start
# Runs on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

| Variable        | Required | Description                                      |
|-----------------|----------|--------------------------------------------------|
| `GEMINI_API_KEY`| ✅ Yes   | Your Google Gemini API key                       |
| `PORT`          | No       | Backend port (default: `3001`)                   |

## API Reference

### `POST /api/debug`

**Request body:**
```json
{
  "language": "Python | JavaScript | C++",
  "error": "Error message or stack trace",
  "code": "The code containing the bug"
}
```

**Success response:**
```json
{
  "success": true,
  "result": {
    "rootCause": "...",
    "explanation": "...",
    "suggestedFix": "...",
    "fixedCode": "..."
  }
}
```

**Error response:**
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### `GET /api/health`

Returns `{ "status": "ok", "service": "BugPilot AI" }` — useful for deployment health checks.

## Deployment Notes

- The frontend Vite dev server proxies `/api` to `http://localhost:3001`.
- For production, build the frontend (`npm run build` in `frontend/`) and serve the `dist/` folder alongside the backend, or deploy them separately and update the API URL.
- Never commit `.env` or expose `GEMINI_API_KEY` in frontend code or logs.
- The backend validates request size (code ≤ 20,000 chars, error ≤ 2,000 chars) to protect against oversized payloads.

## Limitations

- No authentication or user accounts (by design — MVP scope)
- No code execution or sandboxing
- AI diagnosis quality depends on the clarity of the provided error and code
- Gemini API rate limits apply on the free tier

## Future Improvements

- Support more languages (Java, TypeScript, Rust)
- Session history / analysis log
- Line-number highlighting in the editor
- Shareable debug report links
- Dark mode
