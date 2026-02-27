# Mobile Responsive Fix Plan (for Claude Code)

## Goal
Fix the mobile rendering issues shown in `../mobile-screenshots/IMG_1104.PNG` through `IMG_1110.PNG`:
- iOS Safari zoom/crop behavior after focusing form fields.
- Horizontal clipping/overflow perception across app pages.
- Cramped toolbar/filter rows on small widths (especially Contacts and History).

## Primary Root Causes
1. iOS auto-zoom on form controls with small font sizes.
2. Some containers/rows are not optimized for narrow widths.
3. Mobile controls in Contacts/History are visually packed and need explicit stacking rules.

## Implementation Order
Apply changes in this order so the biggest issue is removed first.

### 1) Stop iOS auto-zoom globally
Edit: `src/app/globals.css`

- Add mobile-safe text sizing and prevent Safari text auto-resize side effects.
- Keep accessibility intact (do **not** use `maximum-scale=1`).

Add under `@layer base`:

```css
html {
  -webkit-text-size-adjust: 100%;
}

input,
textarea,
select {
  font-size: 16px;
}
```

Notes:
- This is the highest-impact fix for the screenshot behavior.
- You can still use `md:text-sm` visually on desktop while keeping mobile inputs at 16px.

### 2) Remove autofocus that triggers immediate mobile zoom
Edit: `src/app/login/page.tsx`

- Remove `autoFocus` from the username input.
- Keep input readable on mobile:
  - Use `text-base md:text-sm` on login inputs.

### 3) Harden app shell against horizontal bleed
Edits:
- `src/app/(app)/layout.tsx`
- `src/components/layout/PageWrapper.tsx`

Apply:
- Ensure top-level containers use `w-full` and `min-w-0`.
- Add `overflow-x-clip` (or `overflow-x-hidden`) on app wrapper/main wrapper where needed.
- Keep existing mobile top bar offset behavior (`pt-14`) intact.

Suggested class changes:
- App wrapper: include `w-full overflow-x-clip`.
- Main content: keep `min-w-0`, include `w-full`.
- PageWrapper outer container: include `w-full min-w-0`.

### 4) Fix cramped mobile controls in Contacts
Edit: `src/app/(app)/contacts/page.tsx`

Current issue in screenshots: filter/import/export row is cramped on mobile.

Changes:
- For toolbar row with tag filter + import/export:
  - `flex-col sm:flex-row`
  - `items-stretch`
  - Make action buttons fill width on mobile.
- Keep desktop behavior unchanged from `sm` upward.
- Keep table scroll fallback (`overflow-x-auto`) but reduce horizontal pressure:
  - Tighten paddings for mobile table cells (smaller `px` on base, larger on `sm`).

### 5) Fix cramped mobile controls in History
Edit: `src/app/(app)/history/page.tsx`

Current issue in screenshots: date range filter row is packed.

Changes:
- Replace single wrap row with explicit mobile stacking:
  - `flex-col sm:flex-row`
  - group date inputs in a row on `sm+`, stack on base.
- Keep result count readable; place below controls on base and `ml-auto` on `sm+`.

### 6) Optional usability improvement for mobile sidebar sheet
Edit: `src/components/layout/Sidebar.tsx`

Optional:
- Increase mobile sheet width from fixed `w-52` to something like `w-[85vw] max-w-xs`.
- This does not fix core bug but improves menu usability on phones.

## Non-goals
- No redesign of desktop layout.
- No visual theme changes.
- No backend/state changes.

## QA Checklist (must pass)
Test widths: 320, 375, 390 px.

1. Login:
- Focus username/password fields: no Safari zoom jump.
- Entire card remains fully visible; no clipped right edge.

2. Dashboard:
- No horizontal panning.
- Header, stats cards, and activity blocks align to viewport.

3. Compose:
- Message area, recipients block, and summary fit viewport width.
- No clipped borders on right edge.

4. Contacts:
- Search + tag + import/export controls are usable on mobile.
- Table/list does not cause whole-page horizontal drag.

5. History:
- Date filter controls remain readable and tappable on mobile.
- Broadcast cards fully visible; no right-edge clipping.

6. Sidebar:
- Sheet opens/closes cleanly on mobile.
- Main content behind sheet is dimmed and not visually broken.

## Definition of Done
- No unintended zoom on input focus in iOS Safari.
- No horizontal clipping across listed pages.
- Contacts and History control rows are mobile-usable.
- Desktop layout remains unchanged.

## Suggested Commit Breakdown
1. `fix(mobile): prevent iOS input zoom and tighten app shell overflow`
2. `fix(mobile): make contacts toolbar responsive on small screens`
3. `fix(mobile): stack history date filters for narrow viewports`
4. `chore(mobile): optional sidebar sheet width tuning`

