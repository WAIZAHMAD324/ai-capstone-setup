WORKFLOW.md
WORKFLOW.md
AI Workflow Comparison: Vague vs Precise Prompt
This exercise compares two AI-assisted development approaches while building the same feature: a User Settings form in a Vite + React application. The goal was to demonstrate the difference between using a vague prompt and a precise, constraint-driven prompt with verification steps.

Round 1 – Vague Prompt
Prompt used:

“Create a user settings form in this React app.”

No constraints, no validation rules, no accessibility requirements, and no testing instructions were provided.

Result
The AI generated a fully designed SaaS-style dashboard instead of a simple form. It included:

1000+ lines of JSX
1100+ lines of CSS
Multiple sections (Profile, Security, Notifications, Themes, Privacy)
Theme system with color tokens
LocalStorage persistence
Icons system
Search functionality
Session management
Data export and account deletion modal
Diff evidence (main → feature/settings-vague):

7 files changed
2368 insertions
218 deletions
This version worked visually but significantly exceeded scope. It contained no automated tests and introduced unnecessary complexity. Review effort was high because I had to manually inspect a large codebase to understand what was implemented. The AI mistake here was scope explosion — it optimized for visual completeness rather than requirements clarity.

Round 2 – Precise Prompt with Constraints
The second prompt included:

Explicit field list (Full Name, Email, Password, Confirm Password)
Clear validation rules
Accessibility requirements
Testing requirements (Vitest + React Testing Library)
Instruction to avoid over-engineering
Lint, test, and build verification steps
Result
The AI generated:

A minimal form component (~168 lines)
Inline validation with proper error messages
Disabled submit until valid
Accessible labels and ARIA attributes
4 passing automated tests
Clean lint and successful production build
Diff evidence (main → feature/settings-precise):

8 files changed
1530 insertions
316 deletions
Diff evidence (vague → precise):

1597 insertions
2533 deletions
The precise version removed over 2500 lines of unnecessary code from the vague version.

Key Differences
Area	Vague Prompt	Precise Prompt
Scope	Massive dashboard	Single focused form
Validation	Implicit / unclear	Explicit and enforced
Accessibility	Not guaranteed	Required and implemented
Tests	None	4 automated tests
Review Effort	High	Low
Maintainability	Complex	Clean and minimal
Time & Review Observation
Round 2 initially felt slower because of detailed instructions and test setup. However, total development time (including review and verification) was shorter and more controlled. The verification loop (lint → test → build) significantly reduced uncertainty.

Conclusion
This experiment demonstrates that “using AI” is not the skill — directing AI with constraints, specifications, and verification steps is. A vague prompt led to over-engineering and higher review cost. A structured prompt produced a predictable, testable, and maintainable solution aligned with requirements.

The difference was not just stylistic — it was measurable in lines of code, scope control, and verification quality.

