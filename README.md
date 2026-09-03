# AI Study Buddy (Capstone)

AI Study Buddy is a small Next.js web app for students that turns messy study/meeting notes into clean, structured insights (summary, key decisions, and actionable tasks). I built it to practice shipping a production-ready frontend: accessible UI, meaningful AI integration, validation + error handling, tests, and live deployment.

## Live Demo
- Production URL: https://ai-study-buddy-nine-black.vercel.app
- Notes page: https://ai-study-buddy-nine-black.vercel.app/notes
- Chat page: https://ai-study-buddy-nine-black.vercel.app/chat
- Quiz page: https://ai-study-buddy-nine-black.vercel.app/quiz
- Repository: https://github.com/WAIZAHMAD324/ai-capstone-setup

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- AI: Google Gemini (Free tier)
- Validation: Zod
- Testing: Vitest + React Testing Library (jsdom)
- Deployment: Vercel (auto-deploy from `capstone` branch)

## Setup (Local)
1) Install dependencies (Windows note: may require legacy peer deps)
- Run: `npm install --legacy-peer-deps`

2) Add environment variable
- Create file: `.env.local` (project root)
- Add: `GEMINI_API_KEY=YOUR_KEY_HERE`

3) Start dev server
- Run: `npm run dev`
- Open: http://localhost:3000/notes

## Architecture Overview
- `app/notes/page.tsx`
  - Client UI for entering notes, Load Sample, Clear, loading spinner, and accessible error states.
  - Renders extracted output and allows toggling action items status in the UI.
- `app/api/ai/extract/route.ts`
  - Server route that calls Gemini and returns structured JSON.
  - Validates input and AI output using Zod (fails safely).

- `app/chat/page.tsx`
  - AI chat UI (English-only) that calls the server route `/api/ai/chat`.
  - Stores chat messages in localStorage and shows loading + error UI.
- `app/api/ai/chat/route.ts`
  - Gemini-powered chat endpoint with validation + safe error responses.

- `app/quiz/page.tsx`
  - AI quiz generator UI that calls the server route `/api/ai/quiz`.
  - Shows questions, tracks answers, and displays explanations.
- `app/api/ai/quiz/route.ts`
  - Gemini-powered quiz generator returning structured JSON validated with Zod.

- `app/history/page.tsx`
  - Working History view (localStorage-based).
- `app/settings/page.tsx`
  - Working Settings page (localStorage-based preferences).
- `app/dashboard/page.tsx`
  - Simple dashboard with shortcuts to main features.
- `app/playground/*`
  - Separate accessibility playground (not part of capstone feature; do not modify).

## AI Integration (How it works)
- Purpose (not a gimmick): converts unstructured text into structured data (Notes + Quiz) and provides helpful study guidance (Chat).
- Provider: Google Gemini (free tier)
- Model used: `gemini-flash-lite-latest` (chosen to reduce “high demand / 503” errors seen with other models)
- This project uses Gemini for:
  - Smart Notes extraction (`/notes`)
  - AI Study Chat (`/chat`)
  - AI Quiz generation (`/quiz`)
- Prompt behavior (Notes/Quiz): instructs the model to return ONLY valid JSON (no markdown/code fences) with strict shape.
- Reliability:
  - Server attempts to parse JSON safely
  - Zod validates response before sending it to the client
  - If invalid, API returns a clear error (no broken UI)

## Resilience & Error Handling
- Missing `GEMINI_API_KEY` returns a helpful server message.
- Request validation:
  - Notes input minimum 20 characters
  - Quiz material minimum 40 characters
- UI shows clear loading state + error message (fails safely instead of crashing).

## Testing
- Unit tests added for Notes UI (3 tests).
- Run tests: `npm test`

## Performance & Accessibility Evidence
- Lighthouse (mobile) on `/notes`: Performance 88, Accessibility 100
- WAVE on `/notes`: 0 Errors, 0 Alerts
- Concrete improvement made from audit:
  - Removed redundant “Home” nav link (WAVE previously flagged “Redundant link”).

## Screenshots (Evidence Files)
- `1-test-evidence.png` — Vitest tests passing
- `2-ai-notes-working.png` — Local AI extraction working
- `3-live-ai-working.png` — Live AI working on Vercel `/notes`
- `4-lighthouse-mobile-notes.png` — Lighthouse mobile report
- `5-wave-notes.png` — WAVE report (0 errors, 0 alerts)
- `6-vercel-deploy-ready.png` — Vercel deployments page showing Ready (green)

## Deployment & Operations
- Vercel Production branch: `capstone`
- Monitoring: Vercel Deployments + Logs
- Rollback plan: Vercel dashboard → Deployments → select an older “Ready” deployment → Redeploy

## Deployment Checklist (FE-11 style)
- [x] App deployed and functional (Production)
- [x] `GEMINI_API_KEY` set in Vercel Environment Variables (Production)
- [x] Tests pass locally (`npm test`)
- [x] Lighthouse mobile ≥ 85 on `/notes`
- [x] WAVE: 0 Errors, 0 Alerts on `/notes`
- [x] Safe failure states (loading + error UI)
- [x] Rollback documented (redeploy previous deployment in Vercel)

## Known Limitations & Future Improvements
- AI provider can temporarily rate-limit / overload under high demand.
- Add end-to-end test for the full “paste notes → extract → render output” flow.
- Add persistence (save action items/history) instead of UI-only state.

## Reflection (Short)
- Hardest part: model availability/high demand errors and choosing a stable free model.
- Next time: add E2E tests earlier and add better caching/retry strategy.
- Surprise learning: accessibility audits catch issues like redundant navigation links quickly and clearly.