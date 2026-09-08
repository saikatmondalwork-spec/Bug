# Solution

## How BugPilot AI Works

BugPilot AI is a single-page web application that gives developers an instant, structured debugging report powered by Google Gemini.

## User Workflow

1. **Select a language** — Python, JavaScript, or C++.
2. **Paste the error message** — the full error text or stack trace from the terminal or browser console.
3. **Paste the code** — the function, class, or file that produced the error.
4. **Click "Analyze Bug"** — BugPilot sends the information securely to its backend.
5. **Read the report** — within seconds, the right panel populates with:
   - **Root Cause** — the specific technical reason the error occurred.
   - **Explanation** — a plain-English description suitable for beginners.
   - **Suggested Fix** — a concrete, actionable recommendation.
   - **Fixed Code** — the corrected version of the submitted code, ready to copy.

## How the AI Assists

The backend sends the language, error, and code to Gemini 1.5 Flash with a focused system prompt that instructs the model to:

- Stay strictly within the bounds of the supplied code and error.
- Avoid inventing APIs, variables, or behavior not present in the input.
- Clearly mark uncertain diagnoses as probable rather than definitive.
- Return a structured JSON object — not free-form prose — so the frontend can render each section independently.

The model's temperature is kept low (0.2) to produce consistent, deterministic debugging responses rather than creative or variable answers.

## Why This Approach

- **Structured output** means the frontend always knows what to render — no text parsing, no ambiguity.
- **Focused prompt** keeps the AI on-task and reduces hallucination.
- **Backend-only AI call** means the API key is never exposed to the browser.
- **Minimal stack** (React + Vite + Express) keeps the system reliable and easy to understand.

## Built-in Examples

Six pre-loaded example bugs (2 Python, 2 JavaScript, 2 C++) let users instantly see BugPilot in action without needing to find or write their own buggy code. These cover the most common beginner error classes.
