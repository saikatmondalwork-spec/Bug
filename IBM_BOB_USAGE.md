# IBM Bob Usage

This document describes how IBM Bob (AI coding assistant) was used throughout the development of BugPilot AI.

## Overview

IBM Bob was the primary development tool for this project. All code was generated, reviewed, and refined through Bob in agent mode, following a series of structured prompts (design.md1 through design.md12).

---

## 1. Project Initialization

Bob read `design.md1` and set up the initial project structure:

- Scaffolded a React + Vite frontend using `npm create vite@latest`
- Installed Tailwind CSS via the `@tailwindcss/vite` plugin
- Installed `@monaco-editor/react` for the code editor
- Created the initial `App.jsx` and component stubs
- Configured `vite.config.js` with a dev proxy for `/api`

---

## 2. Requirement Interpretation

Bob read and interpreted each design prompt sequentially, extracting:

- The UI layout requirements (two-column desktop, stacked mobile)
- The API contract (`POST /api/debug` request/response shape)
- The AI prompt design (system instruction, structured JSON output)
- Validation rules (field presence, language allowlist, size limits)
- Security requirements (API key never in frontend, env vars only)

---

## 3. Frontend Generation

Bob generated all frontend components:

- `LanguageSelector.jsx` — toggle buttons with `aria-pressed` for accessibility
- `CodeEditor.jsx` — Monaco Editor wrapper with language mapping
- `ErrorInput.jsx` — accessible textarea with visible label
- `ResultPanel.jsx` — four colour-coded sections with copy-to-clipboard
- `LoadingSpinner.jsx` — animated spinner with `aria-live` for screen readers
- `EmptyState.jsx` — initial state with instructions
- `ExamplePicker.jsx` — dropdown with outside-click-to-close behaviour
- `App.jsx` — full state management, form validation, API call, layout

Bob also produced the example data (`examples.js`) and mock result (`mockResult.js`).

---

## 4. Backend / API Implementation

Bob created the Express backend (`server.js`) including:

- `POST /api/debug` with request body validation (field presence, language allowlist, size limits)
- `GET /api/health` for deployment health checks
- Environment variable loading via `dotenv`
- CORS middleware for development
- Structured error responses that never expose internal details

---

## 5. AI Integration

Bob implemented the Gemini 1.5 Flash integration:

- Used `@google/generative-ai` SDK
- Wrote the system instruction to constrain the model's behaviour
- Set `temperature: 0.2` and `responseMimeType: application/json` for consistent output
- Added defensive JSON parsing (strips accidental markdown fences)
- Validated all four required fields in the model response
- Mapped Gemini errors to safe user-facing messages

---

## 6. Debugging / Fixing Issues

Bob identified and resolved several issues during development:

- Corrected the `package.json` version mismatches after the initial `npm install` was interrupted
- Ensured `backend/.env` was correctly excluded from source control
- Fixed the response field name mismatch (`correctedCode` vs `fixedCode`) between frontend and backend
- Ensured the Vite proxy forwarded `/api` requests correctly to the backend port

---

## 7. Testing

Bob verified the application by:

- Running `npm install` in both `frontend/` and `backend/`
- Running `npm run build` in `frontend/` to confirm a clean production build
- Checking the backend starts and the health endpoint responds
- Reviewing all validation paths (missing fields, wrong language, oversized payload)

---

## 8. Refactoring / Polish

Bob applied a design QA pass:

- Improved typography hierarchy and spacing consistency
- Added proper `role`, `aria-label`, `aria-live`, and `aria-pressed` attributes throughout
- Improved the `ExamplePicker` dropdown with keyboard-accessible focus states
- Made the two-column layout collapse correctly on mobile (`lg:flex-row`)
- Added clear focus ring styles on all interactive elements
- Ensured the "Analyze Bug" button gives inline feedback while loading

---

## 9. Documentation

Bob generated all project documentation:

- `README.md` — full setup, API reference, deployment notes
- `PROBLEM_STATEMENT.md` — the real-world problem BugPilot addresses
- `SOLUTION.md` — product workflow and AI integration explanation
- `ARCHITECTURE.md` — system diagram, design decisions, file structure
- `IBM_BOB_USAGE.md` — this file
- `DEMO.md` — demonstration walkthrough for judges

---

## Accuracy Note

This document describes only work that was actually performed by Bob during this development session. No actions have been fabricated or exaggerated.
