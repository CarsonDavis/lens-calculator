# State of the Art vs VEDA: A Comparative Analysis

**Report Date:** January 19, 2026
**Purpose:** Compare modern web development best practices (2024-2025) against NASA VEDA team standards

---

## Repositories Analyzed

This comparison draws from three sources:

### 1. State of the Art Research (SOTA)
**Source:** Deep research conducted January 2026, synthesizing 52+ authoritative sources including MDN, official documentation, and 2024-2025 technical publications.
**Document:** `research/react-web-dev-guide/report.md`

The SOTA research represents current industry consensus on modern React web development, covering tooling, patterns, and practices that have emerged as standards through 2024-2025.

### 2. veda-ui (Frontend Reference)
**Repository:** https://github.com/NASA-IMPACT/veda-ui
**Description:** React-based frontend for the VEDA (Visualization, Exploration, and Data Analysis) platform. Provides geospatial data visualization, STAC catalog browsing, and interactive mapping capabilities.
**Tech Stack:** React, TypeScript, Parcel, USWDS, Jotai, MapboxGL

### 3. veda-backend (Backend Reference)
**Repository:** https://github.com/NASA-IMPACT/veda-backend
**Description:** Python/FastAPI backend providing STAC API, raster tile serving, and data ingestion services. Deployed as serverless AWS Lambda functions with PostgreSQL/PgSTAC database.
**Tech Stack:** Python 3.12, FastAPI, AWS CDK, Pydantic v2

---

## Executive Summary

| Category | SOTA Alignment | Notes |
|----------|----------------|-------|
| Build Tooling | ⚠️ Divergent | Parcel vs recommended Vite |
| CSS Architecture | ⚠️ Divergent | Multi-system vs single approach |
| State Management | ✅ Aligned | Jotai is a valid modern choice |
| Pre-commit Hooks | ✅ Better | Lefthook superior to Husky |
| Testing | ✅ Aligned | Jest + Playwright (RTL used) |
| TypeScript | ⚠️ Outdated | v4.8.4 vs current v5.x |
| Backend Standards | ✅ Strong | Modern Python, could adopt Ruff |
| Documentation | ⚠️ Gap | Backend has CONTRIBUTING.md, frontend lacks it |

---

## Detailed Comparison

### 1. Build Tooling & Project Setup

| Aspect | SOTA Recommendation | VEDA-UI Actual |
|--------|---------------------|----------------|
| Build tool | Vite | Parcel 2.12 + Gulp |
| Dev server startup | Sub-second | Slower |
| HMR speed | Instant | Standard |
| Plugin ecosystem | Extensive | Limited |
| Configuration | Minimal | Zero-config + Gulp tasks |

**Analysis:**

Vite has become the 2024-2025 standard after Create React App's deprecation (February 2025). It offers:
- 10-100x faster cold starts than traditional bundlers
- Native ESM support
- Shared configuration with Vitest
- Larger plugin ecosystem

VEDA-UI uses Parcel 2.12 with Gulp for custom build orchestration. Parcel's "zero-config" philosophy was appealing when adopted, but the addition of Gulp indicates the team needed customization that Parcel alone couldn't provide.

**Impact:** Medium. The current setup works but adds maintenance burden. Migration to Vite would simplify the build pipeline and improve developer experience.

**Recommendation:** Consider Vite migration for new projects or major refactors. The Gulp tasks would likely be unnecessary with Vite's plugin system.

---

### 2. CSS Architecture

| Aspect | SOTA Recommendation | VEDA-UI Actual |
|--------|---------------------|----------------|
| Primary approach | Tailwind CSS | SCSS + USWDS |
| Secondary | CSS Modules | styled-components |
| Additional | — | Emotion |
| Runtime overhead | Zero | Yes (two CSS-in-JS libs) |
| Design system | Via Tailwind config | USWDS v3.8.1 |

**Analysis:**

This represents the largest architectural divergence. VEDA-UI employs three concurrent CSS methodologies:

1. **SCSS with USWDS** - Required for federal accessibility compliance
2. **styled-components v5.3.3** - Dynamic component styling
3. **Emotion v11.11.3** - Additional CSS-in-JS

The SOTA guide explicitly recommends against CSS-in-JS for new projects due to:
- Runtime performance costs
- React Server Components incompatibility
- Bundle size overhead

However, VEDA has a constraint the general guide doesn't account for: **USWDS (U.S. Web Design System)** is mandated for federal projects and is SCSS-based. This makes the SCSS portion non-negotiable.

**Impact:** High. Two CSS-in-JS libraries (styled-components AND Emotion) creates:
- Confusion about which to use when
- Duplicate runtime overhead
- Inconsistent patterns across components

**Recommendation:**
- Keep SCSS + USWDS (required)
- Consolidate to ONE CSS-in-JS library or migrate dynamic styles to CSS Modules
- Document clear guidelines on when to use each approach

---

### 3. State Management

| Aspect | SOTA Recommendation | VEDA-UI Actual |
|--------|---------------------|----------------|
| Primary library | Zustand | Jotai |
| Server state | TanStack Query | TanStack Query v4 |
| Bundle size | ~1 KB | ~1.2 KB |
| Mental model | Single store (top-down) | Atomic (bottom-up) |

**Analysis:**

This is a legitimate architectural choice, not a deficiency. Both Zustand and Jotai are modern, lightweight state management solutions recommended over Redux for most applications.

The key difference is mental model:
- **Zustand:** Centralized store with selectors, familiar to Redux users
- **Jotai:** Atomic state that composes bottom-up, excellent for derived state

For VEDA's geospatial application with complex interdependent states (map viewport, layer visibility, filters, temporal ranges), Jotai's atomic model offers advantages:
- `jotai-location` for URL state synchronization (shareable map views)
- `jotai-optics` for nested state updates
- Natural fit for derived/computed values common in mapping apps

**Impact:** None. This is a valid modern choice well-suited to the application domain.

**Recommendation:** No change needed. Document the team's rationale for Jotai to help new contributors understand the choice.

---

### 4. Linting & Code Quality

| Aspect | SOTA Recommendation | VEDA-UI Actual |
|--------|---------------------|----------------|
| ESLint config | Flat config (v9) | Legacy config |
| React rules | react, react-hooks | react, react-hooks |
| Accessibility | jsx-a11y | jsx-a11y |
| Additional | — | inclusive-language, fp |
| Formatter | Prettier | Prettier |
| CSS linting | — | Stylelint |

**Analysis:**

VEDA-UI has **stronger** linting than the SOTA baseline in several areas:
- `eslint-plugin-inclusive-language` - Enforces inclusive terminology
- `eslint-plugin-fp` - Encourages functional programming patterns
- Stylelint with `postcss-styled-syntax` for CSS-in-JS linting
- `no-console` rule prevents debug logs in production

The ESLint configuration uses the legacy format rather than the new flat config (ESLint 9), but this is a minor issue that doesn't affect functionality.

**Impact:** Low. Current setup exceeds baseline recommendations.

**Recommendation:** Consider migrating to ESLint flat config during next major ESLint upgrade, but not urgent.

---

### 5. Pre-commit Hooks

| Aspect | SOTA Recommendation | VEDA-UI Actual |
|--------|---------------------|----------------|
| Tool | Husky + lint-staged | Lefthook |
| Parallel execution | Via lint-staged | Native |
| Performance | Good | Better |
| Configuration | package.json / JS | YAML |

**Analysis:**

VEDA-UI uses **Lefthook** instead of the more common Husky + lint-staged combination. This is actually a superior choice:

- **Performance:** Lefthook is written in Go, faster than Node.js-based Husky
- **Parallel execution:** Native support without additional tooling
- **Configuration:** Clean YAML format
- **No post-install hooks:** Avoids npm lifecycle script issues

VEDA's Lefthook config runs three checks in parallel:
```yaml
pre-commit:
  parallel: true
  commands:
    type-check: yarn ts-check
    eslint: yarn eslint {staged_files}
    stylelint: yarn lint:css {staged_files}
```

**Impact:** Positive. VEDA exceeds SOTA recommendation here.

**Recommendation:** None. Consider documenting this choice as a team best practice.

---

### 6. Testing

| Aspect | SOTA Recommendation | VEDA-UI Actual |
|--------|---------------------|----------------|
| Unit/Component | Vitest | Jest 29 |
| Component testing | React Testing Library | React Testing Library |
| E2E | Playwright | Playwright |
| Coverage | Built-in (Vitest) | jest-cov |

**Analysis:**

VEDA-UI aligns with SOTA on testing philosophy:
- Component testing with React Testing Library (user-centric testing)
- E2E testing with Playwright (cross-browser, reliable)
- Proper test utilities and setup files

The use of Jest instead of Vitest makes sense given the Parcel build system. Vitest's advantage is sharing Vite configuration; without Vite, Jest is equally capable.

**Impact:** Low. Testing approach is sound.

**Recommendation:** If migrating to Vite, also migrate to Vitest for unified configuration.

---

### 7. TypeScript Configuration

| Aspect | SOTA Recommendation | VEDA-UI Actual |
|--------|---------------------|----------------|
| Version | 5.x (latest) | 4.8.4 |
| Strict mode | Yes | Yes |
| strictNullChecks | Yes | Yes |

**Analysis:**

TypeScript 4.8.4 was released August 2022. The team is missing significant improvements:

| Feature | Version | Benefit |
|---------|---------|---------|
| `satisfies` operator | 4.9 | Better type inference with validation |
| `const` type parameters | 5.0 | Immutable generics |
| Decorators (stage 3) | 5.0 | Standard decorator syntax |
| `--verbatimModuleSyntax` | 5.0 | Cleaner ESM handling |
| Performance improvements | 5.x | Faster type checking |

**Impact:** Medium. Missing modern TypeScript features that improve developer experience and type safety.

**Recommendation:** Upgrade to TypeScript 5.x. This is typically low-risk and provides immediate benefits.

---

### 8. Project Structure

| Aspect | SOTA Recommendation | VEDA-UI Actual |
|--------|---------------------|----------------|
| Pattern | Feature-based | Hybrid layer/feature |
| Path aliases | Recommended | Yes (`$components/`, etc.) |
| Public API | index.ts exports | Partial |

**Analysis:**

VEDA-UI uses a hybrid structure:

```
src/
├── components/          # Feature-based (exploration/, data-catalog/, etc.)
│   ├── common/          # Shared components
│   └── exploration/
│       ├── atoms/       # Jotai atoms
│       ├── components/
│       ├── hooks/
│       └── views/
├── context/             # Layer-based (all contexts together)
├── data-layer/          # Layer-based
├── utils/               # Layer-based
└── styles/              # Layer-based
```

This hybrid approach works but could benefit from clearer boundaries. The `exploration/` feature shows good internal organization (atoms, components, hooks, views).

Path aliases (`$components/`, `$utils/`, etc.) improve import readability and are a SOTA recommendation.

**Impact:** Low. Structure is functional and partially aligned.

**Recommendation:** Document the intended structure. Consider moving toward fuller feature-based organization for new features.

---

### 9. Environment Management

| Aspect | SOTA Recommendation | VEDA-UI Actual |
|--------|---------------------|----------------|
| Format | .env files with prefixes | .env files |
| Example file | .env.example | .env.local-sample |
| Secrets handling | Server-side only | MAPBOX_TOKEN exposed |
| Documentation | Required vars documented | Yes |

**Analysis:**

VEDA-UI follows standard .env practices with proper separation:
- `.env` - Shared defaults
- `.env.local` - Local overrides (gitignored)
- `.env.local-sample` - Template for developers

Environment variables are well-documented and include feature flags (`ENABLE_*`), API endpoints, and application configuration.

**Impact:** Low. Approach is sound.

**Recommendation:** Ensure sensitive tokens (MAPBOX_TOKEN) are properly managed in deployment environments.

---

### 10. Backend Standards (veda-backend)

| Aspect | SOTA Recommendation | VEDA-Backend Actual |
|--------|---------------------|---------------------|
| Formatter | Black or Ruff | Black 22.3.0 |
| Import sorting | isort or Ruff | isort 5.12.0 |
| Linter | Ruff | flake8 6.1.0 |
| Docstrings | — | pydocstyle 5.1.1 |
| Type checking | mypy or pyright | mypy v1.2.0 |
| Validation | Pydantic v2 | Pydantic v2.4.1+ |
| Commits | Conventional | Conventional (enforced) |

**Analysis:**

veda-backend demonstrates strong Python standards overall. Key observations:

**Strengths:**
- Conventional commits enforced via GitHub Actions
- Automated semantic versioning with python-semantic-release
- Comprehensive pre-commit hooks
- Pydantic v2 for modern validation
- Python 3.12 (current)
- Clear CONTRIBUTING.md with detailed guidelines

**Opportunity:**
The linting stack (Black + isort + flake8 + pydocstyle) could be consolidated to **Ruff**, which:
- Replaces all four tools
- Is 10-100x faster
- Has unified configuration
- Is becoming the Python community standard

**Impact:** Low (current tools work), but consolidation would simplify maintenance.

**Recommendation:** Evaluate Ruff migration. Single tool replaces four with better performance.

---

### 11. Documentation & Onboarding

| Aspect | SOTA Recommendation | VEDA-UI | VEDA-Backend |
|--------|---------------------|---------|--------------|
| CONTRIBUTING.md | Yes | ❌ No | ✅ Yes |
| CLAUDE.md | Recommended | ❌ No | ❌ No |
| Architecture docs | Yes | ✅ docs/adr/ | ✅ Implicit in structure |
| Setup guide | Yes | ✅ docs/development/SETUP.md | ✅ README |

**Analysis:**

The backend repository has clear contribution guidelines documenting:
- Git-flow branching model
- Conventional commit requirements
- PR standards
- Semantic versioning rules

The frontend repository lacks equivalent documentation, which creates onboarding friction and inconsistent practices.

**Impact:** Medium for veda-ui. Contributors may not understand expected patterns.

**Recommendation:**
- Add CONTRIBUTING.md to veda-ui mirroring backend standards
- Consider adding CLAUDE.md files to both repos for AI-assisted development context

---

## Summary: Action Items by Priority

### High Priority
| Item | Repository | Rationale |
|------|------------|-----------|
| Consolidate CSS-in-JS | veda-ui | Two libraries creates confusion and overhead |
| Add CONTRIBUTING.md | veda-ui | Backend has it, frontend should match |
| Upgrade TypeScript | veda-ui | v4.8.4 is 3+ years old, missing key features |

### Medium Priority
| Item | Repository | Rationale |
|------|------------|-----------|
| Evaluate Vite migration | veda-ui | Parcel + Gulp is complex; Vite would simplify |
| Migrate to Ruff | veda-backend | Consolidates 4 tools into 1 with better performance |
| Document CSS guidelines | veda-ui | Clarify when to use SCSS vs styled-components |

### Low Priority (Good as-is)
| Item | Repository | Status |
|------|------------|--------|
| State management | veda-ui | Jotai is well-suited to the domain |
| Pre-commit hooks | veda-ui | Lefthook is superior to Husky |
| Testing approach | Both | Jest + Playwright + RTL is solid |
| Backend Python standards | veda-backend | Strong, modern practices |

---

## Conclusion

The VEDA team's technology choices reflect a mature codebase that predates some current standards. Most divergences from SOTA are either:

1. **Legitimate alternatives** (Jotai, Lefthook) that are equally valid
2. **Constraint-driven** (USWDS requirement for federal compliance)
3. **Technical debt** that accumulated as the ecosystem evolved (Parcel, TypeScript version)

The highest-impact improvements would be:
1. Consolidating the CSS approach
2. Upgrading TypeScript
3. Adding frontend contribution documentation

The backend repository demonstrates excellent modern Python practices and can serve as a model for documentation and workflow standards.
