# How I Built This

I built this with [Claude Code](https://claude.ai/claude-code): roughly 5 hours of upfront planning, documentation, and agentic research, followed by about 2.5 hours of implementation. I've been getting questions about how I approach AI-assisted coding so it's production-robust rather than typical vibe coded junk — so I documented this project as an example.

My approach: co-create documentation deliberately, then manage conversation context to use those artifacts. Always read the full documentation yourself — if you don't know what it says, you don't know what you're building.

I try to take a no-writing approach — I didn't even write this. As of early 2026, if the code is bad, that's not Claude's fault; it means the documentation or context engineering were bad.

Yes, I'll occasionally touch up a requirements doc or an architecture plan, but anything beyond a few lines means my original prompting was bad.

---

## Phase 1: Science Research (Lens Equations)

**Goal:** Understand all the math needed for lens/format equivalence calculations.

1. **Initial deep research** — Asked for comprehensive research on all equations for converting between camera formats: equivalent focal lengths, aperture/depth of field relationships, bokeh calculations. Key insight: we need to handle formats that don't match aspect ratios, so we need options for matching by diagonal, width, height, or area.

2. **Wikipedia scraping problem** — Needed the actual equations from Wikipedia articles on Depth of Field and Circle of Confusion. The web fetcher couldn't get the equations properly (they were in image alt text), so I had it build a Playwright scraper based on existing scraping code in the repo.

3. **Clean equation files** — Got nicely formatted depth_of_field.md and circle_of_confusion.md with all the formulas properly transcribed, including the tables of format-specific CoC values.

4. **Consolidated report** — Had all the research compiled into a single report.md with categorized equations for equivalence, DOF, CoC, and blur calculations.

**Chat log:** [research/lens-equations/chat_messages.md](research/lens-equations/chat_messages.md)

**Files created:**

- [research/lens-equations/report.md](research/lens-equations/report.md) — consolidated equations reference
- [research/lens-equations/depth_of_field.md](research/lens-equations/depth_of_field.md) — Wikipedia DOF article
- [research/lens-equations/circle_of_confusion.md](research/lens-equations/circle_of_confusion.md) — Wikipedia CoC article
- [research/lens-equations/background.md](research/lens-equations/background.md) — extended research notes

---

## Phase 2: Dev Research

**Goal:** Figure out the right tech stack for building this as a modern web app.

1. **State of the art research** — Deep research on modern HTML5/React development: project setup, linting, code quality, environment management, project structure, testing. Generated background.md with 52 sources and a report.md summarizing 2024-2025 best practices.

2. **VEDA team analysis** — I'm working with a team that has existing repos (NASA-IMPACT/veda-backend, NASA-IMPACT/veda-ui). Cloned them to understand their conventions and standards. I wanted to use some of their stack where possible as a learning experience.

3. **SOTA vs VEDA comparison** — Wrote up a gap analysis comparing modern standards with what the VEDA team uses. Important for knowing where to align with the team vs where to use newer approaches.

4. **Final stack decision** — Decided to strike a balance: learn VEDA patterns for familiarity with the team, but use SOTA in other areas. Final stack: Vite, TypeScript, React, Tailwind, Jotai, Vitest, Playwright, ESLint, Prettier, Lefthook.

5. **Mobile design guidelines** — Added mobile-specific guidelines since the app needs to look phenomenal on phones.

**Chat log:** [research/react-web-dev-guide/chat_messages.md](research/react-web-dev-guide/chat_messages.md)

**Files created:**

- [research/react-web-dev-guide/background.md](research/react-web-dev-guide/background.md) — raw research notes (52 sources)
- [research/react-web-dev-guide/report.md](research/react-web-dev-guide/report.md) — SOTA best practices summary
- [research/react-web-dev-guide/sota-vs-veda-comparison.md](research/react-web-dev-guide/sota-vs-veda-comparison.md) — gap analysis
- [research/react-web-dev-guide/final-stack-guide.md](research/react-web-dev-guide/final-stack-guide.md) — final technology decisions
- [research/react-web-dev-guide/mobile-design.md](research/react-web-dev-guide/mobile-design.md) — mobile design guidelines

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

**Chat log:** [design_docs/chat_messages.md](design_docs/chat_messages.md)

**Files created:**

- [design_docs/requirements.md](design_docs/requirements.md) — app inputs, outputs, UI layout
- [design_docs/architecture.md](design_docs/architecture.md) — project structure and tech stack
- [design_docs/architecture-questionnaire.md](design_docs/architecture-questionnaire.md) — first round of decisions
- [design_docs/architecture-questionnaire-2.md](design_docs/architecture-questionnaire-2.md) — follow-up decisions
- [design_docs/calculations.md](design_docs/calculations.md) — formulas by calculation situation
- [design_docs/types.md](design_docs/types.md) — TypeScript data model
- [design_docs/formats.md](design_docs/formats.md) — preset format data
- [design_docs/design-system.md](design_docs/design-system.md) — visual language (colors, typography, spacing)
- [design_docs/info-content.md](design_docs/info-content.md) — plain-language explanations for UI

---

## Phase 4: Calculation Module

**Goal:** Implement the math as a standalone, testable module.

1. **Initial implementation** — Created src/calc/ with all the equivalence, DOF, blur, and format calculations based on the design docs and research.

2. **Test review** — Had the tests reviewed for mistakes. Found several issues:
   - **Blur at infinity formula:** Implementation used approximation `f² / (N × s)` instead of exact `f² / (N × (s - f))`. ~2.5% error at portrait distances, grows for closer subjects.

   - **Crop factor confusion:** Two different conventions in codebase — format.ts uses traditional FF/sensor = 1.6 for APS-C, but equivalence.ts uses target/source = 0.625. Test comment said "~1.6" but expected 0.625.

   - **Weak blur test:** Only checked positivity instead of validating actual calculated value against formula.

3. **Fixes applied** — Updated implementation to use exact formulas, clarified comments, strengthened test assertions.

4. **Cross-format subject distance bug** — Found via screenshots that pinned focal length was giving wrong apertures (APS-C 35mm f/2.0 → FF 50mm was calculating f/1.87 instead of f/2.87). Root cause: the subject distance scaling formula `s_t = s_s × (f_t / f_s)` only works for same-format comparisons. For cross-format, it needs to scale relative to equivalent focal length: `s_t = s_s × (f_t / f_equiv)`. Fixed multiple functions in equivalence.ts.

**Chat log:** [src/calc/chat_messages.md](src/calc/chat_messages.md)

**Files created:**

- [src/calc/README.md](src/calc/README.md) — API reference and usage examples
- src/calc/format.ts — format calculations (diagonal, crop factor, CoC)
- src/calc/equivalence.ts — equivalence calculations between formats
- src/calc/dof.ts — depth of field calculations
- src/calc/blur.ts — blur disc calculations
- src/calc/\*.test.ts — unit tests for all modules

---

## Phase 5: Frontend

**Goal:** Build the React UI based on the design docs.

1. **Initial build** — Read through the README, design docs, and calc module docs, then built out all the UI components: format panels, number inputs, options panel, sensor overlay visualization.

2. **Number formatting fixes** — Wasn't obeying the rounding rules from the architecture. Added formatDisplayValue prop to NumberInput and created specific formatters: focal length (0-1 decimals), aperture user input (1 decimal), aperture calculated (up to 2 decimals), distance (0 decimals).

3. **Dark mode color scheme** — Initial dark mode was black on extremely dark grey, hard to see. Generated a comparison of four options side-by-side to evaluate. Chose "GitHub Dark" scheme: background #0d1117, surface #161b22, border #30363d, text-primary #e6edf3, accent #58a6ff.

4. **Sensor overlay fixes** — Several iterations:
   - Target was same color as background — made both formats visible with distinct colors
   - Labels were overlapping/getting cut off — moved labels out of SVG into a grid below
   - Swapped colors so source (the "reference") gets the accent blue and target gets subtle gray
   - Centered the label text under the visualization

5. **Pre-commit hook fixes** — Lefthook was failing on commit with Prettier formatting issues, ESLint unescaped entities, and setState-in-useEffect warnings. Fixed the code issues, then updated lefthook.yml to auto-fix where possible: ESLint now uses `--fix`, Prettier uses `--write` instead of `--check`, and `stage_fixed: true` re-stages corrected files automatically.

6. **URL persistence** — Implemented shareable URLs with query params for all state (formats, lens settings, options). Added localStorage session persistence as fallback. Added a Share button with icon in the header that copies the URL to clipboard. Also moved crop factor display from header into the Target panel results.

7. **UI bug fixes** — Several refinements based on testing:
   - Override visual indication wasn't clear enough — added accent blue border to overridden inputs
   - Added reset buttons (refresh icon) next to target focal length and aperture when overridden
   - Info panel text was getting cut off — increased max-height
   - Opening one info section now closes any other open section (accordion behavior)

8. **Custom sensor formats** — Added ability for users to create, edit, and delete custom sensor formats.

**Chat log:** [src/chat_messages.md](src/chat_messages.md)

**Files created:**

- src/components/ — all UI components
- src/atoms/ — Jotai state atoms
- src/utils/url.ts — URL serialization/deserialization
- [design_docs/dark-mode-comparisons.png](design_docs/dark-mode-comparisons.png) — color scheme comparison used for selection

---

## Phase 6: CI/CD & Deployment

**Goal:** Set up automated testing and deployment to the web.

1. **Deployment options research** — Wanted to deploy to lens-calc.codebycarson.com. Explored options: Cloudflare Pages (requires manual dashboard setup), AWS S3/CloudFront (existing pattern from other projects), AWS Amplify. Key requirements: PR preview deploys, CI that runs tests.

2. **Chose AWS Amplify** — Easier than raw S3/CloudFront, supports PR previews, minimal ongoing management, and can configure everything via CLI without logging into a dashboard.

3. **Documented the strategy** — Created design_docs/ci-cd.md with the deployment decision and configuration details.

4. **Configuration** — Set up Amplify app, GitHub Actions workflows for CI (tests on PR) and CD (deploy master branch).

**Chat log:** [.github/chat_messages.md](.github/chat_messages.md)

**Files created:**

- [design_docs/ci-cd.md](design_docs/ci-cd.md) — deployment strategy documentation
- .github/workflows/ — CI/CD workflow files

---

## What's Next

- [ ] E2E tests
