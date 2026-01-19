# Modern HTML5 Web Development with React - Research Notes

**Research Date:** January 19, 2026
**Objective:** Comprehensive guide covering HTML5, CSS, React setup, tooling, testing, and deployment best practices for 2024-2025

## Sources

*Sources will be added as research progresses*

## Key Findings

*Key findings will be documented as research progresses*

---

## 1. HTML5 Best Practices, Semantic HTML, and Accessibility

### Core Principle: Semantic HTML First

**"No ARIA is better than bad ARIA"** - WebAim's survey of over one million home pages found that pages with ARIA present averaged 41% more detected errors than those without ARIA. ([Source: MDN ARIA Documentation][1])

**First Rule of ARIA**: "If you can use a native HTML element or attribute with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so." ([Source: web.dev ARIA and HTML][2])

### Semantic Elements Best Practices

- Use semantic elements like `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>` as layout scaffolding
- Each has implicit ARIA roles that reduce the need for explicit `role="..."` attributes
- **Keep only one `<main>` element per page**
- Follow a logical heading progression (h1 -> h2 -> h3) without skipping levels
- Don't wrap every block in `<section>` when a simple `<div>` or `<p>` would be appropriate

([Source: DEV Community - Semantic HTML in 2025][3])

### When ARIA Is Appropriate

ARIA remains valuable for:
- Enhancing existing elements by adding keyboard navigation to custom controls
- Creating complex UI components when HTML lacks necessary semantic elements (tabs, tree views, custom comboboxes)
- Legacy browser support for addressing compatibility issues

([Source: AudioEye - Accessible Coding for Developers][4])

### HTML5 Adoption and Modern Features (2025)

**94.2% of all websites now use HTML5** as of February 2025 (W3Techs). ([Source: Devzery HTML5 Guide][5])

**Key Modern HTML5 Features:**

1. **Semantic Elements**: `<header>`, `<footer>`, `<section>`, `<article>`, `<nav>`, `<aside>`
2. **Native Multimedia**: `<video>` and `<audio>` tags eliminate Flash dependencies
3. **Canvas API**: Draw graphics, animations, games directly in browser
4. **SVG Support**: Native vector graphics that scale without quality loss
5. **Enhanced Dialog Element**: `<dialog>` for modals without JS libraries
6. **Lazy Loading**: Native `loading="lazy"` attribute on images and iframes
7. **Form Enhancements**: New input types (email, date, range, number), attributes (placeholder, autofocus, required)

([Source: All Things Programming - 12 New HTML5 Features][6])

**Important HTML5 APIs:**
- **Geolocation API**: Access user's geographical location
- **Web Storage API**: localStorage and sessionStorage for client-side data
- **Web Workers**: Background processing without blocking main thread
- **IndexedDB**: Client-side database for complex data storage
- **File API**: Read, process, preview files without server uploads
- **Service Workers**: Enable offline functionality and PWA features

([Source: Startup House - HTML5 APIs][7])

### WCAG 2.2 Compliance (2025 Standard)

WCAG 2.2 became the W3C Recommendation in October 2023 and is now the baseline compliance standard for 2025. ([Source: AllAccessible WCAG 2.2 Guide][8])

**9 New Success Criteria in WCAG 2.2:**
1. **Focus Appearance (Enhanced)**: Improved focus indicators
2. **Dragging Movements**: All actions completable without drag gestures
3. **Target Size (Minimum)**: Tap/click targets at least 24x24 CSS pixels
4. Focus Not Obscured (Minimum and Enhanced)
5. Consistent Help
6. Redundant Entry
7. Accessible Authentication

**Legal Landscape 2025:**
- ADA Title II enforcement hitting April 2026
- European Accessibility Act (EAA) now in effect since June 2025
- Lawsuit volumes up 37% in 2025
- **Overlay widgets do NOT provide legal compliance** and have been cited in lawsuits

([Source: AllAccessible WCAG 2.2 Compliance Checklist][9])

### React-Specific Accessibility

**Unique SPA Challenges:**
- Client-side routing without page refreshes
- Dynamic content updates without announcements
- Complex component interactions

**Best Practices:**
1. All `aria-*` HTML attributes are fully supported in JSX (hyphen-cased)
2. Use accessible component libraries: **React Aria** (Adobe), **Radix UI**
3. Implement proper focus management for route changes
4. Use ARIA live regions for dynamic content announcements
5. **Use `eslint-plugin-jsx-a11y`** for static accessibility checking

**Testing:**
- Automated tools detect only ~40% of WCAG 2.2 issues
- Manual testing with screen readers (NVDA, VoiceOver, JAWS) essential
- Tools: Axe DevTools, Lighthouse

([Source: AllAccessible React Accessibility Guide][10])

[1]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
[2]: https://web.dev/learn/accessibility/aria-html
[3]: https://dev.to/gerryleonugroho/semantic-html-in-2025-the-bedrock-of-accessible-seo-ready-and-future-proof-web-experiences-2k01
[4]: https://www.audioeye.com/post/accessible-coding-for-developers/
[5]: https://www.devzery.com/post/features-of-html5-complete-guide
[6]: https://allthingsprogramming.com/12-new-html5-features-for-2025/
[7]: https://startup-house.com/blog/html5-apis-enhanced-web-functionality
[8]: https://www.allaccessible.org/blog/wcag-22-complete-guide-2025
[9]: https://www.allaccessible.org/blog/wcag-22-compliance-checklist-implementation-roadmap
[10]: https://www.allaccessible.org/blog/react-accessibility-best-practices-guide

---

## 2. CSS Guidelines and Modern Approaches

### CSS Styling Solutions Comparison (2025)

#### CSS Modules

**What it is**: CSS Modules allow writing scoped CSS by default, avoiding global namespace issues. Tooling (Webpack/Vite) generates unique class names automatically.

**Pros:**
- Local scoping prevents style bleeding across components
- Full CSS power - animations, media queries, pseudo-selectors
- No new syntax to learn (standard CSS)
- **No runtime overhead** - processed at build time
- Clean separation of HTML and CSS

**Best for:** Smaller apps, legacy migrations, teams preferring traditional CSS

([Source: Medium - CSS Modules vs CSS-in-JS vs Tailwind][11])

#### CSS-in-JS (styled-components, Emotion)

**What it is**: Styles written as JavaScript template literals, converted to CSS rules and injected into `<style>` tags with unique class names.

**Pros:**
- Excellent for dynamic styling based on props/runtime data
- Scoped styles avoid specificity wars
- Elegant theming via React Context
- Components read like design intent

**Cons:**
- **Runtime performance cost** - CSS-in-JS runs in browser to compute styles
- Increases INP (Interaction to Next Paint)
- **Problematic with React Server Components**
- Adds to JavaScript bundle size

([Source: Meerako - Tailwind CSS vs CSS-in-JS 2025][12])

#### Tailwind CSS

**What it is**: Utility-first CSS framework with predefined atomic classes (e.g., `bg-blue-500`, `text-center`).

**Pros:**
- **Zero CSS bloat** - only includes classes actually used
- **No runtime overhead** - static CSS file
- Design system friendly - forces consistent values from config
- Excellent performance with React Server Components
- Predictable bundle size

**Cons:**
- "Ugly" HTML - JSX can get very class-heavy
- Learning curve for pre-built classes
- Can feel restrictive for highly custom designs

**2025 Recommendation:**
- Performance is non-negotiable - Tailwind's zero-runtime cost wins over CSS-in-JS
- Startups/MVPs/Modern SaaS: **Tailwind CSS**
- Legacy codebases/pure CSS control: **CSS Modules**
- Hybrid approach viable: Tailwind for utilities, CSS Modules/CSS-in-JS for complex dynamic components

([Source: Superflex - CSS Modules vs Styled Components vs Tailwind][13])

### Modern CSS Features (2025)

#### Container Queries (Production Ready)

Container queries allow styling based on parent container size, not viewport. Game-changer for component-based responsive design.

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { display: flex; }
}
```

**Best Practice:** Use `container-name` to avoid confusion and keep contexts predictable.

([Source: Builder.io - Modern CSS 2024][14])

#### Native CSS Nesting

CSS nesting is now native - no longer requires Sass or PostCSS.

```css
.card {
  background: white;

  &:hover {
    background: gray;
  }

  .title {
    font-size: 1.5rem;
  }
}
```

**Note:** Using `&` makes child selectors relative to parent element. Without `&`, specificity is like using `:is()`.

([Source: Medium - CSS in 2025][15])

#### CSS Custom Properties (Variables)

Widely adopted for theming and dark mode support. Use `@property` with syntax descriptor for proper computed value comparisons.

```css
@property --theme-primary {
  syntax: '<color>';
  inherits: true;
  initial-value: #3b82f6;
}
```

#### Additional Production-Ready Features

- **`:has()` pseudo-class** - "Parent selector" allowing styling based on child presence
- **Subgrid** - Nested grids inheriting tracks from parent
- **Scroll-driven animations** - Native scroll-linked animations
- **View Transitions API** - Smooth page transitions
- **Popover API** - Native popover behavior

**Browser Compatibility:** Add `@supports` guards for emerging features like `@scope` and anchor positioning for graceful degradation.

([Source: Medium - CSS New Properties 2025][16])

### CSS Naming Conventions

#### BEM (Block-Element-Modifier)

BEM remains relevant in 2025, even with Tailwind and CSS-in-JS prevalence.

**Structure:**
- **Block**: Standalone component (`.button`, `.nav`)
- **Element**: Child of block (`.button__icon`, `.nav__link`)
- **Modifier**: Variation/state (`.button--primary`, `.nav__link--active`)

**Benefits:**
- Reduces code review time by up to 35% (research)
- Clear namespace prevents collisions
- Easy maintenance and scalability

**Best Practices:**
1. Keep specificity low - most selectors should use single class
2. Don't omit class names from child elements (prevents cascade issues)
3. Keep names concise but meaningful (`.user-menu__item` not `.user-navigation-menu__list-item`)
4. Maintain consistency throughout project

([Source: Sparkbox - BEM by Example][17])

### Responsive Design Best Practices

1. **Mobile-first approach** - Start with mobile styles, add complexity for larger screens
2. **Use container queries** for component-level responsiveness
3. **Prefer `rem`/`em` units** over pixels for accessibility
4. **Use CSS Grid and Flexbox** together strategically
5. **Test with real devices** - not just browser DevTools

[11]: https://medium.com/@ignatovich.dm/css-modules-vs-css-in-js-vs-tailwind-css-a-comprehensive-comparison-24e7cb6f48e9
[12]: https://www.meerako.com/blogs/tailwind-css-vs-css-in-js-modern-css-styling-guide-2025
[13]: https://www.superflex.ai/blog/css-modules-vs-styled-components-vs-tailwind
[14]: https://www.builder.io/blog/css-2024-nesting-layers-container-queries
[15]: https://medium.com/@ignatovich.dm/css-in-2025-new-selectors-container-queries-and-ai-generated-styles-3ebf705f880f
[16]: https://medium.com/@mohit_30652/css-new-properties-to-watch-in-2025-5961652cbc5d
[17]: https://sparkbox.com/foundry/bem_by_example

---

## 3. React Project Setup and Modern Tooling

### Create React App Status (2025)

**CRA was officially deprecated on February 14, 2025.** It is no longer maintained and won't receive updates or security patches. Not advisable for long-term projects. ([Source: Zignuts - CRA Alternatives][18])

**Why CRA was deprecated:**
- Uses Webpack 5, which is slow compared to modern bundlers
- Modern tools like Vite are 10-100x faster
- CRA didn't support essential modern features: SSR, SSG, code-splitting optimizations

### Modern Framework Comparison (2025)

#### Vite

**Best for:** Fast SPAs, prototypes, micro-frontends, maximum flexibility

**Key Features:**
- Serves React app as native ES modules during development
- Uses esbuild or SWC for near-instant compilation
- Hot Module Replacement (HMR) feels instant
- Only 31 MB dependencies (vs CRA's 140+ MB)
- Server start time under 1 second even in large repos

**Setup:**
```bash
npm create vite@latest my-react-app -- --template react-ts
```

**Templates available:** TypeScript, TypeScript + SWC, JavaScript, JavaScript + SWC, React Router v7, TanStack Router, RedwoodSDK

([Source: LogRocket - React TypeScript with Vite][19])

#### Next.js

**Best for:** Full-stack apps with SEO, enterprise applications, multiple rendering strategies

**Key Features:**
- Supports SSG, SSR, ISR, and CSR
- Built-in API routes for full-stack development
- Automatic code splitting and image optimization
- File-based routing system
- Next.js 15 ships with React 19 support and stable Turbopack

**Setup:**
```bash
npx create-next-app@latest my-next-app
```

([Source: Strapi - Vite vs Next.js 2025][20])

#### Remix

**Best for:** SSR-first applications, complex data flows, nested routing, progressive enhancement

**Key Features:**
- Server-first routing with loaders and actions
- Now uses Vite bundler (10x faster HMR)
- Maintained by Shopify
- Excellent progressive enhancement support

**Setup:**
```bash
npx create-remix@latest my-remix-app
```

([Source: Merge - Remix vs NextJS 2025][21])

### Framework Selection Guide

| Use Case | Recommendation |
|----------|----------------|
| SaaS dashboard consuming API | Vite |
| Multiple micro-frontends | Vite |
| Enterprise apps with SSR/ISR | Next.js |
| SEO-critical marketing site | Next.js or Remix |
| Complex nested layouts | Remix |
| Quick prototypes | Vite or Parcel |

### React + TypeScript Project Structure

**Recommended Directory Structure:**
```
src/
├── assets/        # Static assets (images, fonts)
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Page-level components
├── services/      # API services
├── styles/        # Global styles
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx
└── main.tsx
```

([Source: Medium - React Vite TypeScript Best Practices][22])

### Vite Configuration Best Practices

**Basic vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

**With Testing (Vitest):**
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
```

### TypeScript Configuration

Enable strict mode in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Naming Conventions

- **Files:** kebab-case (`user-profile.tsx`)
- **Components:** PascalCase (`UserProfile`)
- **Functions/variables:** camelCase (`getUserData`)
- **Types/Interfaces:** PascalCase (`UserProfile`)

### Other Notable Tools (2025)

- **Astro**: Modern site builder, ships less JavaScript by default
- **T3 Stack**: Full-stack TypeScript with type safety (Next.js + tRPC + Prisma)
- **TanStack Start**: Rising framework worth watching
- **Nx**: Build system for monorepos, used by Fortune 500 companies

([Source: DEV Community - Building Modern React Apps 2025][23])

[18]: https://www.zignuts.com/blog/create-react-app-alternatives
[19]: https://blog.logrocket.com/how-to-build-react-typescript-app-vite/
[20]: https://strapi.io/blog/vite-vs-nextjs-2025-developer-framework-comparison
[21]: https://merge.rocks/blog/remix-vs-nextjs-2025-comparison
[22]: https://medium.com/@taedmonds/best-practices-for-react-js-with-vite-and-typescript-what-i-use-and-why-f4482558ed89
[23]: https://dev.to/andrewbaisden/building-modern-react-apps-in-2025-a-guide-to-cutting-edge-tools-and-tech-stacks-k8g

---

## 4. Linting and Code Quality

### ESLint 9 Flat Config (2025 Standard)

ESLint v9 introduces a flat configuration system replacing traditional `.eslintrc` files. Uses `eslint.config.js` (or `.mjs`/`.ts`) instead. ([Source: ESLint Flat Config Tutorial][24])

**Key Changes:**
- Uses `defineConfig()` helper function for type safety
- Configuration is an array of objects (flat structure)
- More explicit, less "magic" inheritance

**Basic TypeScript + React Configuration:**
```javascript
// eslint.config.mjs
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Not needed in modern React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  prettier, // Must be last to override formatting rules
);
```

([Source: JavaScript Plain English - ESLint v9 React Guide][25])

**TypeScript Config Files:** Node.js >= 22.10.0 supports TypeScript config files natively with `--experimental-strip-types`. For earlier versions, install `jiti` v2.0.0+.

**Next.js ESLint (2025):**
```javascript
import { flatConfig } from '@next/eslint-plugin-next';

export default defineConfig(
  flatConfig.recommended,
  flatConfig.coreWebVitals,
);
```

([Source: ESLint Blog - Flat Config Extends][26])

### Essential ESLint Plugins for React

1. **`eslint-plugin-react`**: Core React conventions
2. **`eslint-plugin-react-hooks`**: Rules of Hooks enforcement
3. **`eslint-plugin-jsx-a11y`**: Accessibility rules (WCAG compliance)
4. **`@typescript-eslint/eslint-plugin`**: TypeScript support
5. **`eslint-config-prettier`**: Disables rules that conflict with Prettier

([Source: Moldstud - ESLint Prettier Guide][27])

### Prettier Integration

**Philosophy:** Assign code styling to Prettier, let ESLint handle logical errors and best practices.

**Installation:**
```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

**Prettier Configuration (`.prettierrc`):**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "jsxSingleQuote": false
}
```

**Integration Benefits:**
- 75% of developers prefer hybrid ESLint + Prettier setup (2025 State of JS)
- Reduces formatting-related PR comments by ~40%
- Frees reviewers to focus on architecture and logic

([Source: DEV Community - ESLint Prettier VSCode 2025][28])

### TypeScript Strict Mode

Enable in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Husky + lint-staged (Pre-commit Hooks)

**Purpose:** Run linters/formatters only on staged files before commit. Catches problems early without running on entire codebase.

**Setup:**
```bash
npm install --save-dev husky lint-staged
npx husky init
```

**Configure `.husky/pre-commit`:**
```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

**Configure `package.json`:**
```json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,md,json}": [
      "prettier --write"
    ]
  }
}
```

**Benefits:**
- Automatically format code before committing
- Enforce consistent coding standards
- Prevent ESLint/Prettier issues from reaching repository
- `prepare` script runs automatically after `npm install`

**Bypass (emergency):** `git commit --no-verify`

([Source: Better Stack - Husky and lint-staged][29])

### Editor Integration

Configure VS Code for real-time feedback:

**.vscode/settings.json:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

[24]: https://dev.to/aolyang/eslint-9-flat-config-tutorial-2bm5
[25]: https://javascript.plainenglish.io/how-to-configure-eslint-v9-in-a-react-project-2025-guide-a86d893e1703
[26]: https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/
[27]: https://moldstud.com/articles/p-ultimate-guide-setting-up-eslint-and-prettier-for-your-typescript-react-projects
[28]: https://dev.to/marina_eremina/how-to-set-up-eslint-and-prettier-for-react-app-in-vscode-2025-2341
[29]: https://betterstack.com/community/guides/scaling-nodejs/husky-and-lint-staged/

---

## 5. Environment Management

### Environment Variables by Framework

| Framework | Public Variable Prefix | Access Method |
|-----------|------------------------|---------------|
| Vite | `VITE_` | `import.meta.env.VITE_*` |
| Next.js | `NEXT_PUBLIC_` | `process.env.NEXT_PUBLIC_*` |
| Create React App | `REACT_APP_` | `process.env.REACT_APP_*` |

([Source: DEV Community - Environment Variables in Vite][30])

### Vite Environment Variables

**File Structure:**
```
.env                # Loaded in all cases
.env.local          # Loaded in all cases, ignored by git
.env.development    # Only in development
.env.production     # Only in production
```

**Usage:**
```javascript
// Variables MUST be prefixed with VITE_
const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;
```

**TypeScript IntelliSense:**
```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_API_URL: string;
}
```

**Important:** Restart dev server after modifying `.env` files.

([Source: CodeParrot - Environment Variables in Vite][31])

### Next.js Environment Variables

**File Structure:**
```
.env                # Default environment variables
.env.local          # Local overrides (ignored by git)
.env.development    # Development-only variables
.env.production     # Production-only variables
```

**Server vs Client Variables:**
- Variables WITHOUT `NEXT_PUBLIC_` prefix: Server-side only (Node.js)
- Variables WITH `NEXT_PUBLIC_` prefix: Exposed to browser

```javascript
// Server-side only
const dbPassword = process.env.DATABASE_PASSWORD;

// Client-side accessible
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
```

([Source: Next.js Documentation - Environment Variables][32])

### Secrets Management Best Practices

1. **Never commit `.env` files to version control**
   ```gitignore
   # .gitignore
   .env
   .env.local
   .env*.local
   ```

2. **Use `.env.example` for documentation**
   ```
   # .env.example (commit this file)
   VITE_API_KEY=your_api_key_here
   VITE_API_URL=https://api.example.com
   ```

3. **Keep secrets out of client-side code**
   - Server-side code for sensitive operations
   - API routes in Next.js for secure endpoints

4. **Use dedicated secrets management for production:**
   - AWS Secrets Manager
   - Azure Key Vault
   - HashiCorp Vault
   - Vercel Environment Variables
   - Doppler

([Source: DhiWise - Next.js Environment Security][33])

### Environment-Specific Configuration Pattern

```typescript
// config/environment.ts
const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    debug: true,
  },
  staging: {
    apiUrl: 'https://staging-api.example.com',
    debug: true,
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
  },
};

const env = import.meta.env.MODE as keyof typeof config;
export default config[env] || config.development;
```

[30]: https://dev.to/codeparrot/using-environment-variables-in-react-and-vite-31kc
[31]: https://codeparrot.ai/blogs/using-environment-variables-in-react-and-vite
[32]: https://nextjs.org/docs/pages/guides/environment-variables
[33]: https://www.dhiwise.com/post/how-to-manage-nextjs-environment-variables-for-better-security

---

## 6. Project Structure

### Evolution of React Project Organization

**Small Projects (< 15-20 components):**
Simple flat structure with top-level folders for components, hooks, assets.

**Medium Projects:**
Page-based organization grouping related files by route.

**Large/Enterprise Projects:**
Feature-based architecture - the 2025 gold standard.

([Source: Robin Wieruch - React Folder Structure][34])

### Feature-Based Architecture

**Core Principle:** Organize code by business capabilities instead of technical concerns. Each feature is a self-contained "mini-application."

**Benefits:**
- Higher code cohesion (related items together)
- Easier to add/modify features without touching other parts
- Better for team collaboration (teams own features)
- Predictable and easier to understand

**Recommended Structure:**
```
src/
├── app/              # App-level setup (routes, providers)
│   ├── routes/
│   ├── providers.tsx
│   └── App.tsx
├── features/         # Self-contained business domains
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types.ts
│   │   └── index.ts  # Public API for this feature
│   ├── users/
│   ├── posts/
│   └── dashboard/
├── shared/           # Shared code used across features
│   ├── components/   # Generic UI components
│   ├── hooks/        # Generic hooks
│   ├── utils/        # Utility functions
│   └── types/        # Shared TypeScript types
├── core/             # Global app-wide concerns
│   ├── api/          # API client configuration
│   ├── config/       # App configuration
│   └── constants/
└── assets/           # Static assets
```

([Source: DEV Community - Recommended Folder Structure 2025][35])

### Bulletproof React Approach

**Key Principles:**

1. **Feature Encapsulation:** Most code lives in `features/` folder
2. **Unidirectional Dependencies:** `shared -> features -> app`
3. **Public API per Feature:** Each feature exports only what others need via `index.ts`
4. **Colocation:** Keep related code together

**Feature Folder Structure:**
```
features/
└── auth/
    ├── api/          # API calls for this feature
    ├── components/   # Feature-specific components
    ├── hooks/        # Feature-specific hooks
    ├── stores/       # Feature state (Zustand, etc.)
    ├── types.ts      # Feature types
    ├── utils.ts      # Feature utilities
    └── index.ts      # Public exports
```

**Import Restrictions:**
- Features should NOT import from other features directly
- Cross-feature communication through shared code or app layer

([Source: Bulletproof React - Project Structure][36])

### Layer-Based vs Feature-Based Comparison

| Aspect | Layer-Based | Feature-Based |
|--------|-------------|---------------|
| Organization | By technical type | By business domain |
| Scalability | Harder at scale | Excellent at scale |
| Team work | File conflicts | Teams own features |
| Understanding | Hunt across folders | Related code together |
| Best for | Small projects | Medium to large projects |

([Source: Netguru - React Project Structure 2025][37])

[34]: https://www.robinwieruch.de/react-folder-structure/
[35]: https://dev.to/pramod_boda/recommended-folder-structure-for-react-2025-48mc
[36]: https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md
[37]: https://www.netguru.com/blog/react-project-structure

---

## 7. State Management

### 2025 State Management Landscape

**Progression:** Start simple, scale up as needed.
1. **React Context API** - Built-in, simple use cases
2. **Zustand** - When Context causes re-render issues
3. **Jotai** - Complex interdependent atomic state
4. **Redux Toolkit** - Large teams, complex state requirements

([Source: DEV Community - State Management 2025][38])

### React Context API

**Best for:**
- Theme/locale switching
- User authentication state
- Small amounts of global state that changes infrequently

**Limitations:**
- Re-renders all consumers when ANY context value changes
- Not suitable for frequently changing state

### Zustand

**The 2025 default choice for 90% of applications** (SaaS, MVPs, enterprise dashboards).

**Why Zustand:**
- ~1KB bundle size
- Zero boilerplate
- No providers needed
- Hook-based API
- Great performance with selective subscriptions

**Basic Usage:**
```typescript
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounter = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// In component - only re-renders when count changes
const count = useCounter((state) => state.count);
```

([Source: Meerako - React State Management 2025][39])

### Jotai

**Best for:**
- Fine-grained, atomic state updates
- TypeScript-heavy projects
- Complex UI interactivity with many small state pieces
- Code splitting requirements
- Suspense integration

**Key Difference:** Atoms (tiny independent state pieces) vs single store (Zustand).

**Basic Usage:**
```typescript
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const doubledAtom = atom((get) => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

([Source: Better Stack - Zustand vs Redux Toolkit vs Jotai][40])

### Redux Toolkit

**Best for:**
- Large applications with complex state interactions
- Teams needing strict patterns and predictability
- Advanced DevTools and time-travel debugging needs
- Complex data normalization

**Considerations:**
- More setup than Zustand/Jotai (even with Toolkit)
- Requires middleware for async (RTK Query, thunks)
- Overkill for simple applications

### Quick Comparison

| Feature | Context API | Zustand | Jotai | Redux Toolkit |
|---------|-------------|---------|-------|---------------|
| Bundle Size | 0 (built-in) | ~1KB | ~1.2KB | ~15KB |
| Boilerplate | Low | Very Low | Very Low | Medium |
| Learning Curve | Low | Low | Low | Higher |
| DevTools | React DevTools | Basic | Limited | Excellent |
| Re-render Control | Poor | Excellent | Excellent | Good (selectors) |
| Best Scale | Small | Small-Large | Small-Large | Large |

### Recommendation Flow

1. **"Do I need global state?"** - Try lifting state or composition first
2. **"Simple, infrequent updates?"** - Context API
3. **"Need better performance?"** - Zustand (default choice)
4. **"Highly interdependent atomic state?"** - Jotai
5. **"Large team, complex patterns?"** - Redux Toolkit

([Source: DEV Community - Do You Need State Management 2025][41])

[38]: https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k
[39]: https://www.meerako.com/blogs/react-state-management-zustand-vs-redux-vs-context-2025
[40]: https://betterstack.com/community/guides/scaling-nodejs/zustand-vs-redux-toolkit-vs-jotai/
[41]: https://dev.to/saswatapal/do-you-need-state-management-in-2025-react-context-vs-zustand-vs-jotai-vs-redux-1ho

---

## 8. Testing

### Unit & Component Testing: Vitest vs Jest (2025)

**Vitest is the recommended choice for new projects**, especially those using Vite.

#### Vitest Advantages
- Cold runs up to 4x faster than Jest
- 30% lower memory usage
- Native ESM and TypeScript support
- No complex config (babel-jest, moduleNameMapper)
- Works with existing Vite config
- Modern UI dashboard (vitest/ui)
- 95% Jest-compatible API

#### Jest Advantages
- Mature ecosystem with extensive community support
- Required for React Native
- Better for large monorepos (multi-project runner)
- More Stack Overflow/blog resources

([Source: Medium - Jest vs Vitest 2025][42])

### Vitest + React Testing Library Setup

**Installation:**
```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**vite.config.ts:**
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

**src/test/setup.ts:**
```typescript
import '@testing-library/jest-dom';
```

([Source: Makers Den - React Testing Library Vitest Guide][43])

### React Testing Library Best Practices

1. **Use role-based queries**: `getByRole` over `getByTestId` or class selectors
2. **Test user behavior**: Not implementation details
3. **One assertion focus per test**: Verify single aspect of behavior
4. **Extract common setup**: Into fixtures or helper functions
5. **Avoid testing internals**: Focus on what users see and do

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('increments counter on button click', async () => {
  render(<Counter />);

  const button = screen.getByRole('button', { name: /increment/i });
  await userEvent.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### E2E Testing: Playwright vs Cypress

#### Playwright
**Best for:** Comprehensive cross-browser coverage, complex scenarios, enterprise

**Strengths:**
- Chrome, Firefox, AND Safari (WebKit) support
- Multi-page/multi-domain flows
- Built-in parallel execution
- Strong network mocking
- Auto-wait built-in
- GitHub Actions templates included

#### Cypress
**Best for:** Fast frontend feedback, JavaScript-centric teams, startups

**Strengths:**
- Exceptional debugging UX (time travel)
- Simple setup, intuitive API
- Strong plugin ecosystem
- Component testing support
- Real-time reloading

([Source: FrugalTesting - Playwright vs Cypress 2025][44])

### E2E Comparison Table

| Feature | Playwright | Cypress |
|---------|------------|---------|
| Browsers | Chrome, Firefox, Safari | Chrome, Firefox (no Safari) |
| Languages | JS, TS, Python, C#, Java | JavaScript only |
| Parallel Execution | Built-in | Requires config/dashboard |
| Multi-domain | Full support | Limited (same-origin policy) |
| Debugging | Traces, screenshots, video | Time-travel, live DOM |
| CI Integration | GitHub Actions templates | Dashboard service/plugins |

### When to Choose Each

**Choose Vitest when:**
- Starting new project
- Using Vite
- Performance matters (CI pipelines)

**Choose Jest when:**
- Large existing test suite
- React Native project
- Complex monorepo setup

**Choose Playwright when:**
- Need Safari/WebKit testing
- Complex multi-tab, auth flows
- Enterprise requirements

**Choose Cypress when:**
- Fast frontend validation needed
- Team values debugging experience
- Single-page React apps

([Source: JavaScript Plain English - Jest vs Vitest 2025][45])

[42]: https://medium.com/@ruverd/jest-vs-vitest-which-test-runner-should-you-use-in-2025-5c85e4f2bda9
[43]: https://makersden.io/blog/guide-to-react-testing-library-vitest
[44]: https://www.frugaltesting.com/blog/playwright-vs-cypress-the-ultimate-2025-e2e-testing-showdown
[45]: https://javascript.plainenglish.io/jest-vs-vitest-in-a-react-project-which-one-should-you-use-in-2025-2c254ddfd6f8

---

## 9. Performance Optimization

### Code Splitting with React.lazy and Suspense

**Why:** Reduce initial bundle size by up to 60%, load code only when needed.

**Basic Implementation:**
```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

([Source: DEV Community - React Lazy Loading][46])

### Route-Based Code Splitting

**Highest impact, lowest effort.** Split by route first, then profile for component-level splitting.

```typescript
// routes.tsx
const routes = [
  {
    path: '/',
    element: lazy(() => import('./pages/Home')),
  },
  {
    path: '/products',
    element: lazy(() => import('./pages/Products')),
  },
  {
    path: '/checkout',
    element: lazy(() => import('./pages/Checkout')),
  },
];
```

### Vite Automatic Code Splitting

Vite automatically splits code based on dynamic imports. No complex configuration needed.

```typescript
// This creates a separate chunk
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

([Source: Strapi - Lazy Loading in React][47])

### Bundle Analysis

**Tools:**
- **webpack-bundle-analyzer**: Interactive visualization
- **source-map-explorer**: Lightweight analysis
- **Lighthouse**: Performance auditing
- **Vite Bundle Analyzer**: For Vite projects

**What to look for:**
- Dependencies contributing most to bundle size
- Duplicate modules across chunks
- Large assets/components worth splitting

**Installation (Vite):**
```bash
npm install -D rollup-plugin-visualizer
```

**vite.config.ts:**
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
});
```

([Source: DEV Community - React Performance Optimization][48])

### React Performance Best Practices (2025)

**High-Impact Optimizations (60-80% of gains):**
1. **React Compiler** (React 19+): Automatic memoization
2. **Code splitting**: Route-based first
3. **Image optimization**: Next.js Image, lazy loading
4. **Proper state management**: Avoid unnecessary re-renders

**Memoization:**
```typescript
// useMemo for expensive calculations
const sortedItems = useMemo(() =>
  items.sort((a, b) => a.price - b.price),
  [items]
);

// useCallback for stable function references
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []);

// memo for component memoization
const ExpensiveList = memo(({ items }) => (
  <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
));
```

### Common Performance Pitfalls

1. **Over-splitting**: Too many chunks = too many HTTP requests
2. **Flash of loading state**: Design meaningful loading skeletons
3. **Missing keys in lists**: Causes unnecessary re-renders
4. **Inline object/function props**: Create new references each render
5. **Premature optimization**: Profile first, optimize second

([Source: Zignuts - React Performance Guide 2025][49])

### Performance Metrics to Track

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID/INP (Interaction to Next Paint)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 800ms
- **Bundle size**: Monitor growth over time

[46]: https://dev.to/shyam0118/react-lazy-loading-boosting-performance-with-code-splitting-45lg
[47]: https://strapi.io/blog/lazy-loading-in-react
[48]: https://dev.to/naelawadallah/optimizing-react-performance-memoization-lazy-loading-and-bundle-analysis-4bcb
[49]: https://www.zignuts.com/blog/react-app-performance-optimization-guide

---

## 10. Build and Deployment

### Deployment Platforms (2025)

#### Vercel
**Best for:** Next.js, SSR/ISR, dynamic React apps

**Features:**
- Optimized for Next.js (creator of the framework)
- Preview deployments for every Git push
- Edge Functions and global CDN
- ISR (Incremental Static Regeneration)
- Automatic HTTPS

#### Netlify
**Best for:** Static sites, React SPAs, JAMstack

**Features:**
- Reliable CI/CD pipeline
- Build plugins for optimization
- Built-in forms and identity
- Instant rollbacks
- Generous free tier

([Source: Northflank - Vercel vs Netlify 2025][50])

### CI/CD Integration

Both platforms offer **automatic deployment on Git push**:
1. Connect GitHub/GitLab repository
2. Auto-detect React/Next.js framework
3. Configure build command (usually auto-detected)
4. Deploy to global CDN with HTTPS

**Build Commands:**
```bash
# Vite
npm run build  # outputs to dist/

# Next.js
npm run build  # outputs to .next/
```

([Source: Kite Metric - Deploying Vite React Apps][51])

### Platform Selection Guide

| Use Case | Recommended Platform |
|----------|---------------------|
| Next.js with SSR/ISR | Vercel |
| React SPA | Netlify or Vercel |
| Static documentation site | Netlify |
| Asia-focused deployment | Cloudflare Pages |
| Full-stack with database | Render or Railway |

### Build Optimization Best Practices

1. **Enable branch protection**: Require CI tests before merging
2. **Use preview deployments**: Test changes before production
3. **Monitor bundle size**: Set size budgets in CI
4. **Cache dependencies**: Speed up CI builds
5. **Enable automatic rollbacks**: Quick recovery from bad deploys

### Environment Configuration

**Vercel:**
- Settings > Environment Variables
- Supports Development/Preview/Production scopes

**Netlify:**
- Site settings > Build & deploy > Environment
- `.env` values for build-time variables

### Full-Stack Architecture Pattern

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │
│  (Vercel/       │     │  (Railway/      │
│   Netlify)      │     │   Render)       │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │    Database     │
                        │ (MongoDB Atlas/ │
                        │   PlanetScale)  │
                        └─────────────────┘
```

([Source: Nucamp - Deploying Full Stack Apps 2026][52])

### Cost Considerations

| Platform | Free Tier | Scaling Model |
|----------|-----------|---------------|
| Vercel | Generous (hobby) | Usage-based |
| Netlify | Generous | Usage-based |
| Cloudflare Pages | Unlimited bandwidth | Free tier excellent |
| Render | Limited | Predictable pricing |

**Tip:** Start with free tiers, monitor usage, scale when needed.

[50]: https://northflank.com/blog/vercel-vs-netlify-choosing-the-deployment-platform-in-2025
[51]: https://kitemetric.com/blogs/deploying-your-vite-and-react-app-to-production
[52]: https://www.nucamp.co/blog/deploying-full-stack-apps-in-2026-vercel-netlify-railway-and-cloud-options

---

