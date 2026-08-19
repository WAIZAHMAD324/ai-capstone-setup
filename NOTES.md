# NOTES — A11y Playground (Manual vs shadcn/ui)

## What I built by hand (in /playground)
I implemented three interactive widgets from scratch in React + TypeScript (no component libs):

1) **Disclosure**
- Button uses `aria-expanded` and `aria-controls`
- Content uses `role="region"` and `aria-labelledby`
- Keyboard: Tab to button, Enter/Space toggles

2) **Tabs** (manual activation)
- Tabs use `role="tablist"`, each tab `role="tab"` with `aria-selected` + `aria-controls`
- Panels use `role="tabpanel"` with `aria-labelledby`
- Roving `tabIndex` (only one tab is tabbable at a time)
- Keyboard:
  - ArrowLeft/ArrowRight: move focus between tabs
  - Home/End: jump to first/last
  - Enter/Space: activate selected tab

3) **Modal Dialog**
- Dialog uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`
- Focus management:
  - On open: focus moves inside dialog (first focusable, otherwise dialog itself)
  - Focus trap: Tab / Shift+Tab stays inside
  - Escape closes
  - On close: focus returns to previously-focused element


## What shadcn/ui (Radix) handled that my manual version can miss

### Dialog (components/ui/dialog.tsx)
Concrete gaps / differences I noticed:

1) **Robust focus management + focus guards**
- Radix handles focus trapping more reliably (including edge cases like nested dialogs / multiple layers).
- My version traps focus using a document keydown listener and manual querying, which is easier to break in complex cases.

2) **Background interaction blocking**
- Radix prevents interacting with the background in more complete ways.
- My version mainly prevents focus from leaving, but it does not “inert/hide” the rest of the page for assistive tech.

3) **Portals and layering**
- shadcn uses a Portal (`DialogPortal`) so the dialog renders at a stable DOM root layer.
- My version renders inline; z-index/stacking and parent overflow can cause issues in real layouts.

4) **Accessible close button pattern**
- shadcn close button includes an icon + `sr-only` text (“Close”) which is a reliable screen-reader label.
- My version uses `aria-label="Close dialog"` which is fine, but shadcn’s pattern is more consistent and reusable.

5) **Title/Description primitives**
- shadcn exposes `DialogTitle` and `DialogDescription` primitives.
- My modal only guarantees `aria-labelledby` (title), but I didn’t implement `aria-describedby` support for description.

### Tabs (components/ui/tabs.tsx)
Concrete gaps / differences I noticed:

1) **Radix handles full ARIA/keyboard behavior via primitives**
- It provides a well-tested tabs pattern with roving focus and correct ARIA wiring internally.
- My version works, but it’s more likely to miss edge cases (dynamic tab lists, multiple tabsets, direction/orientation changes).

2) **State + styling hooks**
- shadcn/Radix components expose useful state attributes like `data-state` which makes styling and testing easier.
- My version manually computes selected/focus state and styles.

3) **More complete behavior across variants**
- Radix supports additional behaviors (orientation, looping rules, more consistent disabled handling).
- I implemented a basic horizontal tablist with manual activation.


## Resources followed
- W3C ARIA Authoring Practices:
  - Dialog (Modal): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
  - Tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- shadcn/ui docs: https://ui.shadcn.com/