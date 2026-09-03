# Deployment Checklist (Capstone)

Project: AI Study Buddy  
Branch: capstone (Production)  
Live URL: https://ai-study-buddy-nine-black.vercel.app  
Notes URL: https://ai-study-buddy-nine-black.vercel.app/notes  

## Pre-deploy
- [x] `npm test` passes locally
- [x] No secrets committed (API keys only in `.env.local` and Vercel env)
- [x] Error states exist (loading + error UI) and app fails safely

## Environment Variables
- [x] Vercel Production has `GEMINI_API_KEY` set (Secret)
- [x] Local `.env.local` has `GEMINI_API_KEY`

## Build / Deploy
- [x] Vercel deployment from `capstone` completes successfully (Ready/green)
- [x] Live `/notes` AI extraction works end-to-end

## Performance / Accessibility
- [x] Lighthouse mobile on `/notes` ≥ 85
- [x] WAVE on `/notes`: 0 Errors, 0 Alerts
- [x] Improvement made from audit documented (removed redundant Home link)

## Monitoring / Rollback Plan
- [x] Monitoring: Vercel Deployments + Logs
- [x] Rollback: Vercel → Deployments → select older “Ready” deployment → Redeploy

## Sign-off
- Date: ____________
- Checked by: Waiz Ahmad