# How I Used IBM Bob to Build BugPilot AI

> A judge-facing document explaining how IBM Bob (AI coding assistant) was used as the primary development tool throughout this hackathon project.

---

## What is IBM Bob?

IBM Bob is an AI coding assistant built into the development environment. It operates in **agent mode** — meaning it can read files, write code, run commands, and make decisions across the whole codebase, not just answer questions. Think of it as a senior engineer pair-programming alongside you in real time.

---

## How I Used Bob: The Prompt-Driven Workflow

Instead of writing code manually, I created a series of structured design prompts (`design.md1` through `design.md12`) — each one describing a specific phase of the project. I then fed these to Bob one at a time and let it execute.

This is what that looked like in practice:

---

### Phase 1 — Project Setup (`design.md1`)

I told Bob the product goal, tech stack, and rules:

> *"Create BugPilot AI — a React + Vite + Tailwind frontend, Node.js backend, Monaco Editor, Gemini API. Never expose API keys in the browser. Keep it simple."*

Bob:
- Ran `npm create vite@latest` to scaffold the frontend
- Installed Tailwind CSS, Monaco Editor, and all dependencies
- Set up `vite.config.js` with a `/api` proxy to the backend
- Created the initial component structure

---

### Phase 2 — Full Frontend UI (`design.md2`)

I described the layout I wanted:

> *"Two-column layout. Left: language selector, error input, Monaco code editor, Analyze + Clear buttons, example loader. Right: results panel with root cause, explanation, fix, and fixed code. All four states: empty, loading, success, error."*

Bob generated every component from scratch:

| Component | What Bob built |
|-----------|---------------|
| `LanguageSelector.jsx` | Toggle buttons for Python / JavaScript / C++ with `aria-pressed` accessibility |
| `CodeEditor.jsx` | Monaco Editor wrapper with language-to-syntax mapping |
| `ErrorInput.jsx` | Accessible textarea with visible label |
| `ResultPanel.jsx` | Four colour-coded sections (root cause, explanation, fix, fixed code) |
| `LoadingSpinner.jsx` | Animated spinner with `aria-live` for screen readers |
| `EmptyState.jsx` | First-time guidance state |
| `ExamplePicker.jsx` | Dropdown that closes on outside click |
| `App.jsx` | Full state machine: form validation, API call, layout |

---

### Phase 3 — Design Polish (`design.md3`)

I asked Bob to review its own output as a senior designer:

> *"Audit the UI for visual hierarchy, spacing, typography, button states, and accessibility. Make it look production-ready."*

Bob tightened spacing, added focus rings on every interactive element, improved label associations, and ensured the two-column layout stacked correctly on mobile.

---

### Phase 4 — Backend API (`design.md4`)

> *"Build a minimal Express backend. One endpoint: POST /api/debug. Validate all fields. Reject bad payloads. Return structured JSON. Never crash on AI failure."*

Bob created `backend/server.js` with:
- Full request body validation (field presence, language allowlist, payload size limits)
- `GET /api/health` for deployment checks
- Clean error response shape: `{ success: false, error: "Human-readable message" }`
- No internal error details ever leaked to the client

---

### Phase 5 — Gemini Integration (`design.md5`)

> *"Integrate Gemini 1.5 Flash. API key from environment variable only. System instruction constrains the model to the supplied code and error. Response must be structured JSON."*

Bob wrote the full Gemini integration:
- Used `@google/generative-ai` SDK
- Wrote the system prompt that tells the model to act as BugPilot and never invent information
- Set `temperature: 0.2` and `responseMimeType: 'application/json'` for consistent output
- Added defensive JSON parsing that strips accidental markdown fences
- Validated all four required fields (`rootCause`, `explanation`, `suggestedFix`, `fixedCode`) before returning

---

### Phase 6 — Frontend ↔ Backend Wiring (`design.md6`)

> *"Connect the frontend to the real API. Handle loading, success, failure. No duplicate submissions. Preserve input on failure."*

Bob updated `App.jsx` to:
- Send `{ language, error, code }` to `/api/debug`
- Show the loading spinner while waiting
- Render the structured result in the right panel on success
- Display a clear, non-technical error message on failure

---

### Phase 7 — Example Bug Library (`design.md7`)

> *"Add 6 built-in examples: 2 Python, 2 JavaScript, 2 C++. Each has a title, language, error, and code. Load them with one click."*

Bob created `frontend/src/data/examples.js` with six real, deterministic bugs chosen to clearly demonstrate each error class — and wired them to the `ExamplePicker` dropdown.

---

### Phase 8 — Validation & Error Handling (`design.md8`)

> *"Reliability pass. Test every failure scenario: empty fields, whitespace, oversized input, AI failure, network failure, duplicate clicks, copy button."*

Bob reviewed every error path and hardened:
- Client-side validation with specific, actionable messages per missing field
- Server-side size limits (code ≤ 20,000 chars, error ≤ 2,000 chars)
- Duplicate submission prevention while loading
- Safe Gemini error handling that never exposes internals

---

### Phase 9 — Final Polish (`design.md9`)

> *"Final pass. Clean UI, no placeholder text, no console logs, no dead code. Production build must pass."*

Bob ran `npm run build`, confirmed a clean output (217 KB JS, 19 KB CSS), and removed all development noise.

---

### Phase 10 — Deployment Prep (`design.md10`)

> *"Document environment variables. Create .env.example. Write README with setup instructions."*

Bob created `backend/.env.example`, the full `README.md` with local setup steps, API reference, and deployment notes.

---

### Phase 11 — Full Documentation (`design.md11`)

> *"Write PROBLEM_STATEMENT.md, SOLUTION.md, ARCHITECTURE.md, IBM_BOB_USAGE.md, DEMO.md for judges."*

Bob wrote all five documents, including the architecture diagram and the 2.5-minute demo walkthrough script.

---

### Phase 12 — Final QA (`design.md12`)

> *"Act as QA engineer. Check every MVP requirement. Report pass/fail."*

Bob performed a final review pass confirming: clean build, no exposed API key, working validation, correct API contract, accessible UI, and complete documentation.

---

## What I Added on Top of Bob's Work

After Bob built the foundation, I extended the app with some of my own ideas:

- **Accept / Revert Changes flow** — when AI returns a fix, it automatically loads into the editor and prompts the user to accept or revert, just like a real IDE diff review
- **Demo fallback mode** — the app works without a Gemini API key, using pre-built responses so judges can see results even without live AI
- **Model fallback chain** — if one Gemini model is unavailable, the backend tries the next candidate automatically

---

## Summary

| What Bob did | What I did |
|-------------|------------|
| Scaffolded the entire project | Designed the prompt sequence |
| Built all 8 frontend components | Added accept/revert changes UX |
| Built the Express backend | Added demo fallback mode |
| Integrated Gemini API | Added model fallback chain |
| Wrote all validation logic | Gave feedback and directed each phase |
| Ran builds and fixed errors | Reviewed and refined outputs |
| Wrote all 6 documentation files | Wrote the design prompt files |

Bob did the implementation. I did the product thinking, the prompting, and the creative additions on top.

---

*Built at hackathon speed using IBM Bob in agent mode.*
