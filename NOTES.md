# NOTES.md — Manual A11y Components vs shadcn/ui (Radix)

## What I built by hand (playground/)
I built 3 components from scratch in React + TypeScript (no component libraries):
- Disclosure
- Tabs
- Modal Dialog

All tested keyboard-only (Tab, Shift+Tab, Enter/Space, Arrow keys, Escape).

## Modal: My implementation vs shadcn/ui Dialog (Radix)

### Gaps / things shadcn (Radix) handles better (at least 2)
1) **More robust focus management**
   - Radix handles focus trapping + focus guards + edge cases (nested dialogs, tricky DOM cases) in a well-tested way.
   - My modal uses a manual `keydown` listener + querySelector focusables, which can miss edge cases.

2) **Better “background isolation”**
   - Radix more reliably prevents interaction with the background (and manages stacking via Portal).
   - My modal is visually an overlay and traps focus, but the rest of the page is still “there” and can be tricky for assistive tech in complex apps.

3) **Portal + layering**
   - shadcn uses `DialogPortal` so dialog renders in a stable top layer (less z-index/overflow bugs).
   - My modal renders inline; parent overflow/z-index could break it.

4) **Description semantics**
   - Radix supports `DialogDescription` easily (aria-describedby pattern).
   - My modal only wires the title (`aria-labelledby`) and I didn’t implement `aria-describedby`.

## Tabs: My implementation vs shadcn/ui Tabs (Radix)

1) **APG behavior is built-in and tested**
   - Radix handles ARIA wiring + keyboard behavior across cases.
   - My tabs work for basic use, but could miss advanced cases (orientation, dynamic tabs, etc).

2) **Better state hooks for styling**
   - shadcn/Radix provides `data-state` attributes etc for styling and consistent behavior.

## Resources
- ARIA APG Dialog (Modal): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- ARIA APG Tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- shadcn/ui: https://ui.shadcn.com/