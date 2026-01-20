# Project Building Log

This documents the process of how I built this lens equivalence calculator, what I figured out when, and how I thought about decisions.

---

## Phase 1: Science Research (Lens Equations)

**Goal:** Understand all the math needed for lens/format equivalence calculations.

1. **Initial deep research** — Asked for comprehensive research on all equations for converting between camera formats: equivalent focal lengths, aperture/depth of field relationships, bokeh calculations. Key insight: we need to handle formats that don't match aspect ratios, so we need options for matching by diagonal, width, height, or area.

2. **Wikipedia scraping problem** — Needed the actual equations from Wikipedia articles on Depth of Field and Circle of Confusion. The web fetcher couldn't get the equations properly (they were in image alt text), so I had it build a Playwright scraper based on existing scraping code in the repo.

3. **Clean equation files** — Got nicely formatted depth_of_field.md and circle_of_confusion.md with all the formulas properly transcribed, including the tables of format-specific CoC values.

4. **Consolidated report** — Had all the research compiled into a single report.md with categorized equations for equivalence, DOF, CoC, and blur calculations.

---

## Phase 2: Dev Research (React Web Stack)

**Goal:** Figure out the right tech stack for building this as a modern web app.

1. **State of the art research** — Deep research on modern HTML5/React development: project setup, linting, code quality, environment management, project structure, testing. Generated background.md with 52 sources and a report.md summarizing 2024-2025 best practices.

2. **VEDA team analysis** — I'm working with a team that has existing repos (NASA-IMPACT/veda-backend, NASA-IMPACT/veda-ui). Cloned them to understand their conventions and standards. I wanted to use some of their stack where possible as a learning experience.

3. **SOTA vs VEDA comparison** — Wrote up a gap analysis comparing modern standards with what the VEDA team uses. Important for knowing where to align with the team vs where to use newer approaches.

4. **Final stack decision** — Decided to strike a balance: learn VEDA patterns for familiarity with the team, but use SOTA in other areas. Final stack: Vite, TypeScript, React, Tailwind, Jotai, Vitest, Playwright, ESLint, Prettier, Lefthook.

5. **Mobile design guidelines** — Added mobile-specific guidelines since the app needs to look phenomenal on phones.

---

## Phase 3: Design & Architecture

**Goal:** Plan out exactly what we're building before writing code.

### Initial Requirements

1. **Core features from research** — Started by looking at the lens equations research to understand what calculations matter, then outlined core features and optional expansions.

2. **Requirements vs architecture separation** — Caught myself mixing architecture into requirements. Separated them: requirements first (what the app does), architecture second (how it's built).

3. **Key requirements decisions:**
   - Format selection always visible
   - User picks everything on source side, then just sensor on target side
   - Default matches focal length, but user can pin focal length to see matching aperture
   - Presets with custom format option
   - DOF and blur disc are different calculations (not interchangeable)

### First Architecture Questionnaire

Answered a structured questionnaire covering:
- **Calculation engine:** Separate package from UI for modularity/testing. Support metric and imperial (old lenses use inches).
- **State:** Recalculate on every render (not memoized). Override boolean per field that affects CSS styling.
- **Format data:** Separate file, persistable custom formats in localStorage, users can name custom formats.
- **Persistence:** Shareable URLs, localStorage for session, no cloud/accounts.
- **Deployment:** Static site, no analytics, no PWA.
- **Platform:** Mobile-first responsive web (not native apps). "Who uses desktop anymore?"
- **Testing:** Unit tests for calculations, E2E for UI, visual regression for sensor overlay.
- **Accessibility:** Full WCAG, keyboard navigation.
- **Performance:** SVG for sensor overlay.

### Design Decisions

1. **UI layout:** Side by side panels, expandable sections, dropdowns with real number inputs, real-time calculation.

2. **Override behavior:** Users can type to override calculated values (subtle font style change). Deleting reverts to calculated.

3. **Subject distance insight:** When comparing lenses, you're NOT comparing the same physical distance. You're comparing taking the same photo — so with an 85mm you'd stand further back than with a 50mm to frame the same subject.

4. **Design system:** Dark mode only. Clean, modern, minimalistic — "shouldn't look at the site and think 2020, it should be effortlessly modern."

### Second Architecture Questionnaire

Gap analysis revealed more decisions needed:

1. **URL format:** Individual query params with short keys (human-readable, debuggable). Custom formats use width/height params: `?sw=43.8&sh=32.9&sn=GFX&sl=63...`

2. **Validation:** Clamp to valid range on blur (not keystroke) with brief indicator. Show contextual warnings on edge cases rather than blocking input. "Photographers experiment. Better to calculate and educate than refuse."

3. **Custom format UI:** Modal dialog with minimal fields (name, width, height).

4. **Responsive layout:** Disagreed with fixed breakpoint recommendation. Went with content-driven fluid layout — side-by-side when viewport > 2× panel min-width, stack otherwise.

5. **Defaults:** FF 50mm f/1.8 → APS-C. Most common question photographers ask.

6. **Number formatting:** Auto-switch distance units (mm < 1m, meters 1-100m, ∞ for hyperfocal). Calculated apertures show up to 2 decimals.

7. **Digital medium format:** Add by sensor size with brand examples: "Digital MF 44×33 (Fuji GFX, Hasselblad X)"

8. **Options panel:** Collapsed by default with segmented buttons. Most users want diagonal + blur disc defaults.

### Info Content

Wrote plain-language explanations for the educational panels covering:
- Focal length equivalence (FOV changes, not perspective)
- Light gathering vs bokeh (f/1.8 same exposure, different blur)
- DOF vs blur disc (usually coupled, can diverge when focal lengths differ)

### Mobile Design Integration

Reviewed mobile design guidelines and updated design-system.md with rem-based sizing philosophy.

---

## Phase 4: Calculation Module

**Goal:** Implement the math as a standalone, testable module.

1. **Initial implementation** — Created src/calc/ with all the equivalence, DOF, blur, and format calculations based on the design docs and research.

2. **Test review** — Had the tests reviewed for mistakes. Found several issues:

   - **Blur at infinity formula:** Implementation used approximation `f² / (N × s)` instead of exact `f² / (N × (s - f))`. ~2.5% error at portrait distances, grows for closer subjects.

   - **Crop factor confusion:** Two different conventions in codebase — format.ts uses traditional FF/sensor = 1.6 for APS-C, but equivalence.ts uses target/source = 0.625. Test comment said "~1.6" but expected 0.625.

   - **Weak blur test:** Only checked positivity instead of validating actual calculated value against formula.

3. **Fixes applied** — Updated implementation to use exact formulas, clarified comments, strengthened test assertions.

---

## What's Next

- [ ] UI components
- [ ] State management with Jotai
- [ ] URL persistence
- [ ] Sensor overlay visualization
- [ ] E2E tests

