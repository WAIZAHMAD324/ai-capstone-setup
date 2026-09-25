# Portfolio (Waiz Ahmad)

A minimal, clean single-page frontend portfolio focused on real proof (screenshots + links).

## What’s inside
- `index.html` — single-page portfolio (Work / About / Contact)
- `styles.css` — small design system (dark UI, spacing, cards)
- `assets/img/` — screenshots + images used as proof

## How to run (local)
Option 1: open `index.html` in your browser.

Option 2 (recommended): VS Code → Live Server (right-click `index.html` → **Open with Live Server**).

## Design notes (judgment rules)
- Keep it simple: 1 accent color, 1 font family, consistent spacing
- The design should frame the work, not compete with it
- Prefer real screenshots over AI images for proof
- Accessibility basics: readable contrast, clear headings, useful alt text

## Evidence (screenshots)
Portfolio page (top to bottom):
- `assets/img/portfolio-page-01.png`
- `assets/img/portfolio-page-02.png`
- `assets/img/portfolio-page-03.png`

Project proof screenshots:
- `assets/img/study-buddy.png`
- `assets/img/keyboard-playground.png`

Notes:
- Real screenshots used for proof (not AI-generated).
- Minimal UI with one accent color so the work stands out.

---

## How to add the next case study (so this portfolio never goes stale)

### Where the next case goes (exact place)
- File: `index.html`
- Section: `<section id="work">`
- Add: a new `<article class="project">` **after the last project**.

### The 3-beat case study shape (Week 2)
Use these 3 lines inside the project card (short + direct):
1) **Problem:** What was the user/dev problem?
2) **What I did:** What I built + key decisions (UI/a11y/state/components).
3) **Outcome:** What shipped / improved (include screenshot + Live/Code).

### Steps (checklist)
1) Put screenshot in: `assets/img/` (example: `todo-app.png`)
2) Update `index.html`:
   - Title + 1-line description
   - Screenshot `<img>` (real)
   - Links: Live + Code
   - Add 3-beat (Problem / What I did / Outcome)
3) Quick test: open `index.html` and confirm layout + links
4) Ship:
   - `git add -A`
   - `git commit -m "Add case: Todo App (Prompt Ladder)"`
   - `git push`

### Next real piece of work to add (named)
- **Todo App — Frontend Prompt Ladder Assignment**
  - Code: https://github.com/WAIZAHMAD324/ai-capstone-setup/tree/frontend-prompt-ladder/frontend-prompt-ladder-assignment

### Reminder (concrete nudge)
- **Google Calendar event:** “Add portfolio case study: Todo App (Prompt Ladder)”
- **Schedule:** Weekly — every Tuesday, **3:36 PM (PKT)**

**Evidence (reminder screenshot):**
- Add this file to the repo after you export/download it:
  - `assets/img/calendar-reminder-todo-app.png`

### Keep build context cheap (don’t rebuild)
- Keep using the same **Claude Project**.
- For each new case, paste:
  - the 3 beats (Problem / What I did / Outcome)
  - Live link + Code link
  - screenshot filename
- Ask Claude to draft the new `<article class="project">` in your exact site style.