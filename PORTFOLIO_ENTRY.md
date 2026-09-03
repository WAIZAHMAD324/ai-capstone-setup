# Portfolio Entry — AI Study Buddy (Capstone)

## Project Brief (1 paragraph)
AI Study Buddy is a production-ready Next.js app for students that turns unstructured study/meeting notes into structured insights (summary, key decisions, and actionable tasks), and also provides AI-powered chat and quiz generation. I chose this idea to practice shipping a complete frontend product end-to-end: accessible UI, reliable AI integration with structured outputs, validation and safe error states, tests, and real deployment with operational documentation.

## Live Application
- Production: https://ai-study-buddy-nine-black.vercel.app
- Notes: https://ai-study-buddy-nine-black.vercel.app/notes
- Chat: https://ai-study-buddy-nine-black.vercel.app/chat
- Quiz: https://ai-study-buddy-nine-black.vercel.app/quiz

## Repository
- GitHub: https://github.com/WAIZAHMAD324/ai-capstone-setup
- Production branch: `capstone`

## Setup & Run (Local)
- Install: `npm install --legacy-peer-deps`
- Dev server: `npm run dev`
- Tests: `npm test`
- Env: create `.env.local` in project root:
  - `GEMINI_API_KEY=YOUR_KEY_HERE`

## Architecture Overview
- `app/notes/page.tsx`: Notes UI (input, sample loader, clear, loading + error UI, renders structured results and action items toggles)
- `app/api/ai/extract/route.ts`: Gemini call for Notes extraction; JSON parsing + Zod validation
- `app/chat/page.tsx`: AI chat UI (English-only), loading + error UI, localStorage persistence
- `app/api/ai/chat/route.ts`: Gemini-powered chat endpoint; request validation + safe errors + timeout
- `app/quiz/page.tsx`: AI quiz generator UI (interactive MCQ quiz + explanations)
- `app/api/ai/quiz/route.ts`: Gemini quiz endpoint returning structured JSON validated with Zod + timeout
- `app/history/page.tsx`: Working History view (localStorage-based)
- `app/settings/page.tsx`: Working Settings page (localStorage-based)
- `app/dashboard/page.tsx`: Shortcuts to main tools
- `app/playground/*`: Separate accessibility playground (not modified)

## AI Integration (How it fits + why it’s meaningful)
Provider: Google Gemini (Free tier)  
Model: `gemini-flash-lite-latest` (selected to reduce “high demand / 503” errors observed on other models)

- Notes: Prompted to return ONLY valid JSON in a strict schema (summary/decisions/actionItems). Output is parsed and validated with Zod before the UI uses it.
- Quiz: Generates MCQs as structured JSON (title + questions/options/correctIndex/explanation). Output is validated with Zod to avoid unreliable rendering.
- Chat: Generates English-only study coaching replies via a server route, with timeout + safe error handling.

## Resilience & Safe Failure
- Missing `GEMINI_API_KEY` returns a clear server error message.
- Input validation:
  - Notes: minimum 20 characters
  - Quiz: minimum 40 characters
- Loading + error states are shown in the UI instead of crashing.
- Timeouts prevent long hangs on AI requests.

## Testing Evidence
- Vitest + React Testing Library unit tests for Notes UI (3 passing tests)
- Evidence screenshot: `docs/screenshots/1-test-evidence.png`

## Performance & Accessibility Audit Evidence
- Lighthouse (mobile) `/notes`: Performance 88, Accessibility 100
  - Evidence: `docs/screenshots/4-lighthouse-mobile-notes.png`
- WAVE `/notes`: 0 Errors, 0 Alerts
  - Evidence: `docs/screenshots/5-wave-notes.png`
- Concrete improvement from audit: removed redundant “Home” nav link (WAVE “Redundant link” alert)

## Deployment & Operation
- Deployment: Vercel Production auto-deploy from `capstone`
- Monitoring: Vercel Deployments + Logs
- Rollback: redeploy an older “Ready” deployment from Vercel UI
- Deployment checklist file: `DEPLOYMENT_CHECKLIST.md`
- Vercel Ready proof: `docs/screenshots/6-vercel-deploy-ready.png`

## Known Limitations & Future Improvements
- AI provider can temporarily rate-limit or overload under high demand.
- Add end-to-end tests for critical flows (Notes extraction, Quiz generation, Chat message flow).
- Add persistence for action items and quiz history (currently mostly UI/localStorage).

## Reflection
- Reflection file: `REFLECTION.md`