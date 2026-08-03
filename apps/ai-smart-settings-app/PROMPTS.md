Create a minimal, production-quality Settings page in a Vite + React (JavaScript) application.

Requirements:

Fields:
- Full Name (required, minimum 3 characters)
- Email (required, valid email format)
- Password (required, minimum 6 characters)
- Confirm Password (must match Password)

Behavior:
- Real-time validation
- Show inline error messages
- Disable submit button if form is invalid
- Show success message on valid submission
- Save form data to localStorage
- Load saved data from localStorage on page load

UI Constraints:
- Keep the UI minimal and clean
- Do not add dashboards, sidebars, or extra sections
- Do not use external UI libraries
- Keep code modular and readable

Technical Constraints:
- Use functional components
- Use React hooks (useState, useEffect)
- Separate validation logic into helper functions
- Keep code under 250 lines if possible

Accessibility:
- Proper labels connected to inputs
- Use semantic HTML

Do not over-engineer.
Only implement what is specified.