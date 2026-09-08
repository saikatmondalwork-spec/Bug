# Problem Statement

## The Challenge of Debugging

Debugging is one of the most frustrating and time-consuming activities in software development. For beginners, a single cryptic error message can mean hours of confusion — searching Stack Overflow, reading documentation they barely understand, and often making the problem worse before making it better.

## Who Struggles Most

- **Beginner developers** learning Python, JavaScript, or C++ who encounter their first IndexError, TypeError, or segmentation fault and have no mental model for what went wrong.
- **Students** under time pressure (homework deadlines, exams) who need to understand bugs quickly, not just copy a fix.
- **Self-taught developers** without a mentor or senior engineer to consult.
- **Developers switching languages** who bring assumptions from one language that break silently in another.

## The Core Problem

Error messages in Python, JavaScript, and C++ are often technically correct but practically unhelpful:

- `IndexError: list index out of range` — where? which list? why?
- `TypeError: Cannot read properties of undefined (reading 'name')` — undefined what? from where?
- `Segmentation fault (core dumped)` — no line number, no hint, just a crash.

These messages tell you **what** happened but rarely **why** it happened or **how** to fix it.

## Why Existing Solutions Fall Short

- **Stack Overflow** requires knowing the right search terms and sifting through answers that may not match your code.
- **General-purpose chatbots** work but require the user to craft a good prompt, interpret an unstructured wall of text, and still extract the relevant fix.
- **Debuggers** are powerful but have a steep learning curve for beginners.
- **Linters** catch syntax errors but not logical bugs.

## The Opportunity

There is a clear gap for a tool that takes exactly what a developer already has — an error message and the code that caused it — and returns a focused, structured, beginner-friendly debugging report in seconds.
