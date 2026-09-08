# Architecture

## Overview

BugPilot AI follows a simple two-tier architecture: a React frontend and a Node.js/Express backend. The frontend never communicates with the Gemini API directly — all AI calls are made exclusively from the backend.

```
┌──────────────────────────────────────────────────────┐
│                    Browser                           │
│                                                      │
│  React + Vite + Tailwind CSS + Monaco Editor         │
│                                                      │
│  ┌──────────────────┐   ┌──────────────────────────┐ │
│  │   Input Panel    │   │     Results Panel        │ │
│  │  - Language      │   │  - Root Cause            │ │
│  │  - Error Input   │   │  - Explanation           │ │
│  │  - Code Editor   │   │  - Suggested Fix         │ │
│  │  - Analyze btn   │   │  - Fixed Code + Copy     │ │
│  └──────────────────┘   └──────────────────────────┘ │
│                                                      │
└──────────────────┬───────────────────────────────────┘
                   │  POST /api/debug
                   │  { language, error, code }
                   ▼
┌──────────────────────────────────────────────────────┐
│              Node.js / Express Backend               │
│                                                      │
│  1. Validate request fields                          │
│  2. Check language is allowed                        │
│  3. Check payload size limits                        │
│  4. Build prompt + system instruction                │
│  5. Call Gemini API (server-side only)               │
│  6. Parse + validate JSON response                   │
│  7. Return structured result to browser              │
│                                                      │
└──────────────────┬───────────────────────────────────┘
                   │  HTTPS + GEMINI_API_KEY (env only)
                   ▼
┌──────────────────────────────────────────────────────┐
│              Google Gemini 1.5 Flash                 │
│                                                      │
│  Returns JSON:                                       │
│  { rootCause, explanation, suggestedFix, fixedCode } │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Key Design Decisions

| Decision | Reason |
|----------|--------|
| API key on backend only | Security — never exposed to the browser |
| JSON response from Gemini | Predictable rendering, no text parsing |
| Gemini 1.5 Flash | Fast, low-cost, sufficient quality for debugging |
| Low temperature (0.2) | Consistent, deterministic debugging answers |
| Vite dev proxy | Avoids CORS issues during local development |
| No database | MVP scope — stateless, no persistence needed |
| No authentication | MVP scope — single-user demo tool |

## File Structure

```
bugpilot-ai/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main app layout + state
│   │   ├── components/
│   │   │   ├── LanguageSelector.jsx  # Language toggle buttons
│   │   │   ├── CodeEditor.jsx        # Monaco Editor wrapper
│   │   │   ├── ErrorInput.jsx        # Error/stack trace textarea
│   │   │   ├── ResultPanel.jsx       # Structured result display + copy
│   │   │   ├── LoadingSpinner.jsx    # Loading state
│   │   │   ├── EmptyState.jsx        # Initial empty state
│   │   │   └── ExamplePicker.jsx     # Example bug dropdown
│   │   └── data/
│   │       ├── examples.js           # 6 built-in example bugs
│   │       └── mockResult.js         # Mock result for UI testing
│   └── vite.config.js               # Vite + Tailwind + proxy config
└── backend/
    ├── server.js                    # Express server + Gemini integration
    ├── .env.example                 # Environment variable template
    └── package.json
```

## Data Flow — Happy Path

1. User fills in language, error, and code, then clicks **Analyze Bug**.
2. `App.jsx` validates fields client-side (prevents empty submissions).
3. Frontend POSTs `{ language, error, code }` to `/api/debug`.
4. Express validates the body (presence, type, size limits, allowed languages).
5. Backend sends a prompt to Gemini 1.5 Flash with `temperature: 0.2` and `responseMimeType: application/json`.
6. Gemini returns JSON; backend parses and validates all four required fields.
7. Backend responds `{ success: true, result: { ... } }`.
8. Frontend renders each field in its own colour-coded section.
9. User can copy the fixed code to clipboard with one click.

## Error Handling

| Failure point | Frontend behaviour |
|---------------|-------------------|
| Empty fields | Inline validation message, no API call |
| Network failure | "Could not reach the server" error banner |
| Backend 4xx | Field-specific error message from server |
| Gemini failure | Generic "AI analysis failed" message (no internals exposed) |
| Missing API key | "AI service not configured" message |
