# Reflection (Capstone)

## What was hardest (and why)?
The hardest part was making the AI integration reliable on the free tier. I initially tried Anthropic/Claude, but free credits were not available. After switching to Gemini, I still hit “high demand / 503” issues on some models, which caused slow responses and failures. I solved this by selecting a more stable model (`gemini-flash-lite-latest`) and keeping strong validation + error handling so the UI fails safely.

## What would I do differently next time?
I would plan reliability earlier: pick the final model early, add retries/timeouts, and add an end-to-end test for the main flow. I would also write the README and checklist sooner so documentation doesn’t become last-minute work.

## One thing I learned that surprised me
Accessibility tools are very practical. A small navigation detail (a redundant Home link pointing to the same URL as the logo) was immediately flagged by WAVE. Fixing it was quick, and it improved overall usability and quality.