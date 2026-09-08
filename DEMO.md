# Demo Walkthrough

This guide describes a 2–3 minute live demonstration of BugPilot AI using one built-in example from each supported language.

## Prerequisites

- Backend running on `http://localhost:3001` with `GEMINI_API_KEY` set
- Frontend running on `http://localhost:5173`
- Browser open to the frontend

---

## Demo Flow (~2.5 minutes)

### Opening (~20 seconds)

> "BugPilot AI is a debugging assistant that takes a programming language, an error message, and some code, then uses Gemini AI to explain exactly what went wrong and how to fix it."

Point to:
- The language selector (Python / JavaScript / C++)
- The error input field
- The Monaco code editor
- The "Analyze Bug" button
- The empty state on the right: *"Paste an error message and code, then click Analyze Bug to begin."*

---

### Example 1 — Python IndexError (~40 seconds)

1. Click **Try Example** → select **Python — IndexError**
2. Show that the language switches to Python, the error field populates with `IndexError: list index out of range`, and the code editor fills with the buggy function.
3. Click **Analyze Bug**.
4. While loading: *"The request goes to our Node.js backend, which calls Gemini 1.5 Flash. The API key never touches the browser."*
5. Result appears. Walk through each section:
   - **Root Cause**: off-by-one, accessing `items[len(items)]`
   - **Explanation**: plain English for a beginner
   - **Suggested Fix**: use `items[-1]`
   - **Fixed Code**: corrected function — click **Copy** to demonstrate clipboard feedback

---

### Example 2 — JavaScript TypeError (~40 seconds)

1. Click **Try Example** → select **JavaScript — TypeError**
2. Note the language switches to JavaScript automatically.
3. Click **Analyze Bug**.
4. Result appears. Highlight:
   - The root cause: `find()` returning `undefined` when no match is found
   - The fix: add a guard before accessing `.name`
5. Click **Copy** on the fixed code again.

---

### Example 3 — C++ Array Out of Bounds (~40 seconds)

1. Click **Try Example** → select **C++ — Array Out of Bounds**
2. Show the C++ code in the editor — a `for` loop with `i <= 5` on a 5-element array.
3. Click **Analyze Bug**.
4. Result appears. Highlight:
   - Root Cause: `i <= 5` accesses index 5, which is out of bounds for `arr[5]`
   - Suggested Fix: change to `i < 5`

---

### Closing (~20 seconds)

> "BugPilot works entirely through the backend — the Gemini API key is never sent to the browser. The response is structured JSON, so each section always renders correctly regardless of what the AI returns."

Point to:
- The **Clear** button — resets everything
- The responsive layout — the columns stack on mobile

---

## Validation Demo (optional, ~30 seconds)

1. Click **Clear**.
2. Click **Analyze Bug** without filling in any fields.
3. Show the inline validation message: *"Please enter an error message and paste your code."*
4. Fill in only the error, leave code empty, click again — shows *"Please paste the code you want to debug."*

This demonstrates that the application validates inputs before making any API calls.
