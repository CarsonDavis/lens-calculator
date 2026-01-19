# Modern HTML5 Web Development with React: A Comprehensive Guide (2024-2025)

**Research Date:** January 19, 2026

## Executive Summary

This guide consolidates best practices for modern React web development based on the 2024-2025 landscape. The key recommendations are:

- **Tooling:** Use **Vite** for new projects (CRA is deprecated). Choose **Next.js** for SSR/SEO needs, **Remix** for complex data flows.
- **CSS:** **Tailwind CSS** leads for performance; CSS Modules for traditional CSS control. Avoid CSS-in-JS for new projects due to runtime costs.
- **State Management:** **Zustand** is the default choice for 90% of apps. Use Context API only for simple, infrequent updates.
- **Testing:** **Vitest** over Jest for new projects. **Playwright** for cross-browser E2E, **Cypress** for fast frontend feedback.
- **Code Quality:** ESLint 9 flat config + Prettier + Husky/lint-staged + TypeScript strict mode.
- **Deployment:** **Vercel** for Next.js, **Netlify** for SPAs and static sites.

---

## 1. HTML5 Best Practices

### Semantic HTML: The Foundation

**Core Principle:** "No ARIA is better than bad ARIA." Use native HTML elements first; they have built-in accessibility.

**Essential Semantic Elements:**
```html
<header>   <!-- Site header/navigation -->
<nav>      <!-- Navigation links -->
<main>     <!-- Primary content (ONE per page) -->
<article>  <!-- Self-contained content -->
<section>  <!-- Thematic grouping with heading -->
<aside>    <!-- Tangentially related content -->
<footer>   <!-- Footer information -->
```

**Best Practices:**
- Use only ONE `<main>` element per page
- Follow logical heading hierarchy (h1 -> h2 -> h3) without skipping levels
- Don't wrap everything in `<section>` - use `<div>` when no semantic meaning is needed
- Use `<button>` for actions, `<a>` for navigation

### Accessibility (WCAG 2.2)

WCAG 2.2 is the 2025 compliance standard, now enforced by ADA and the European Accessibility Act.

**Key Requirements:**
- **Target Size:** Minimum 24x24 CSS pixels for clickable elements
- **Focus Indicators:** Visible, enhanced focus states
- **Keyboard Navigation:** All interactive elements must be keyboard accessible
- **Form Labels:** Every input needs an associated label

**React-Specific Accessibility:**
```tsx
// Use eslint-plugin-jsx-a11y for static checking
// Install: npm install -D eslint-plugin-jsx-a11y

// Good: Semantic button with accessible name
<button onClick={handleSubmit} aria-label="Submit form">
  <Icon name="check" />
</button>

// Good: Accessible form input
<label htmlFor="email">Email</label>
<input id="email" type="email" required aria-describedby="email-hint" />
<span id="email-hint">We'll never share your email</span>
```

**Testing:** Automated tools (Axe, Lighthouse) catch only ~40% of issues. Manual testing with screen readers (NVDA, VoiceOver) is essential.

---

## 2. CSS Guidelines

### Recommended Approach: Tailwind CSS

Tailwind CSS is the 2025 default for performance-critical applications.

**Why Tailwind:**
- Zero runtime overhead (static CSS)
- Automatic tree-shaking (only used classes in bundle)
- Design system enforcement via config
- Excellent React Server Components support

```tsx
// Tailwind example
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
  Click me
</button>
```

### Alternative: CSS Modules

Best for teams preferring traditional CSS or migrating legacy projects.

```tsx
// Button.module.css
.button {
  background: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

// Button.tsx
import styles from './Button.module.css';
<button className={styles.button}>Click me</button>
```

### Avoid: CSS-in-JS for New Projects

CSS-in-JS (styled-components, Emotion) has runtime costs problematic for React Server Components. Use only for highly dynamic styling needs.

### Modern CSS Features (Production-Ready)

**Container Queries:** Component-level responsive design.
```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { display: flex; }
}
```

**Native CSS Nesting:**
```css
.card {
  background: white;

  &:hover { background: #f5f5f5; }

  .title { font-size: 1.5rem; }
}
```

**CSS Custom Properties:** Essential for theming.
```css
:root {
  --color-primary: #3b82f6;
  --color-text: #1f2937;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-text: #f9fafb;
}
```

---

## 3. React Project Setup

### Create React App is Dead

CRA was deprecated February 2025. Modern alternatives are 10-100x faster.

### Recommended: Vite

```bash
npm create vite@latest my-app -- --template react-ts
```

**Why Vite:**
- Sub-second server starts
- Instant Hot Module Replacement
- 31 MB dependencies (vs CRA's 140+ MB)
- Native ESM and TypeScript support

### When to Choose Each Framework

| Use Case | Framework |
|----------|-----------|
| SPA consuming API | Vite |
| SEO-critical marketing site | Next.js |
| Enterprise app with SSR/ISR | Next.js |
| Complex nested routing, progressive enhancement | Remix |
| Quick prototype | Vite |

### Project Structure: Feature-Based Architecture

For medium-to-large projects, organize by business domain, not technical type.

```
src/
├── app/                  # App setup, routes, providers
│   ├── routes/
│   ├── providers.tsx
│   └── App.tsx
├── features/             # Business domains (self-contained)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── stores/
│   │   ├── types.ts
│   │   └── index.ts      # Public exports
│   ├── users/
│   └── dashboard/
├── shared/               # Cross-feature utilities
│   ├── components/       # Generic UI (Button, Modal)
│   ├── hooks/            # Generic hooks
│   ├── utils/
│   └── types/
└── core/                 # Global concerns
    ├── api/              # API client setup
    └── config/
```

**Key Principles:**
- Features don't import from other features directly
- Unidirectional flow: `shared -> features -> app`
- Each feature has a public API via `index.ts`

---

## 4. Linting and Code Quality

### ESLint 9 Flat Config

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
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  prettier,
);
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### TypeScript Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Pre-commit Hooks with Husky

```bash
npm install -D husky lint-staged
npx husky init
```

```json
// package.json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

---

## 5. Environment Management

### Vite Environment Variables

```bash
# .env files
.env                # All environments
.env.local          # Local overrides (gitignored)
.env.development    # Development only
.env.production     # Production only
```

```typescript
// Prefix with VITE_
const apiUrl = import.meta.env.VITE_API_URL;
```

### Next.js Environment Variables

```typescript
// Server-only (no prefix)
const secret = process.env.DATABASE_PASSWORD;

// Client-accessible (NEXT_PUBLIC_ prefix)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Security Best Practices

1. **Never commit `.env` files** - add to `.gitignore`
2. **Create `.env.example`** - document required variables
3. **Keep secrets server-side** - use API routes for sensitive operations
4. **Production secrets:** Use AWS Secrets Manager, Vercel Environment Variables, or Doppler

---

## 6. State Management

### Decision Flow

1. **Do you need global state?** Try lifting state or composition first
2. **Simple, infrequent updates?** React Context API
3. **Need better performance?** Zustand (default choice)
4. **Complex interdependent atoms?** Jotai
5. **Large team, strict patterns?** Redux Toolkit

### Zustand (Recommended Default)

```typescript
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// In component - only re-renders when user changes
function Profile() {
  const user = useAuthStore((state) => state.user);
  return <div>{user?.name}</div>;
}
```

### Quick Comparison

| Library | Bundle | Boilerplate | Best For |
|---------|--------|-------------|----------|
| Context API | 0 KB | Low | Simple, infrequent state |
| Zustand | ~1 KB | Very Low | Most applications |
| Jotai | ~1.2 KB | Very Low | Atomic, interdependent state |
| Redux Toolkit | ~15 KB | Medium | Large teams, complex patterns |

---

## 7. Testing

### Unit/Component Testing: Vitest + React Testing Library

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits form with valid data', async () => {
  render(<ContactForm />);

  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText(/thank you/i)).toBeInTheDocument();
});
```

### E2E Testing

**Playwright** for cross-browser (including Safari), complex flows, enterprise.
**Cypress** for fast feedback, great debugging, JavaScript-centric teams.

```typescript
// Playwright example
import { test, expect } from '@playwright/test';

test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await expect(page.locator('h1')).toHaveText('Order Confirmed');
});
```

---

## 8. Performance Optimization

### Code Splitting (Highest Impact)

```typescript
import { lazy, Suspense } from 'react';

// Split by route
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

### Bundle Analysis

```bash
npm install -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
});
```

### Performance Checklist

- [ ] Route-based code splitting implemented
- [ ] Images use lazy loading (`loading="lazy"`)
- [ ] Bundle analyzed for large dependencies
- [ ] Lists have proper keys
- [ ] Memoization used for expensive calculations
- [ ] No inline object/function props in hot paths

### Target Metrics

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| INP (Interaction to Next Paint) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Initial bundle size | Monitor growth |

---

## 9. Build and Deployment

### Platform Recommendations

| Use Case | Platform |
|----------|----------|
| Next.js with SSR/ISR | Vercel |
| React SPA | Netlify or Vercel |
| Static documentation | Netlify |
| Asia-focused | Cloudflare Pages |
| Full-stack with database | Render or Railway |

### CI/CD Best Practices

1. **Branch protection:** Require tests to pass before merge
2. **Preview deployments:** Every PR gets a preview URL
3. **Bundle size monitoring:** Set size budgets in CI
4. **Automatic rollbacks:** Quick recovery from bad deploys

### Deployment Checklist

- [ ] Environment variables configured per environment
- [ ] Build command and output directory set
- [ ] Preview deployments enabled
- [ ] Domain and HTTPS configured
- [ ] Error monitoring set up (Sentry, etc.)

---

## Quick Start Template

For a new React project with these best practices:

```bash
# Create project
npm create vite@latest my-app -- --template react-ts
cd my-app

# Install dependencies
npm install zustand
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-config-prettier
npm install -D prettier husky lint-staged

# Initialize tools
npx tailwindcss init -p
npx husky init
```

This gives you:
- Vite with TypeScript
- Tailwind CSS
- Vitest + React Testing Library
- ESLint 9 flat config + Prettier
- Husky pre-commit hooks
- Zustand for state management

---

## Sources

This guide synthesizes research from 50+ sources including:

- [MDN Web Docs - ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [web.dev - Accessibility](https://web.dev/learn/accessibility/)
- [AllAccessible - WCAG 2.2 Guide](https://www.allaccessible.org/blog/wcag-22-complete-guide-2025)
- [Builder.io - Modern CSS 2024](https://www.builder.io/blog/css-2024-nesting-layers-container-queries)
- [Zignuts - CRA Alternatives](https://www.zignuts.com/blog/create-react-app-alternatives)
- [Strapi - Vite vs Next.js 2025](https://strapi.io/blog/vite-vs-nextjs-2025-developer-framework-comparison)
- [Bulletproof React - Project Structure](https://github.com/alan2207/bulletproof-react)
- [DEV Community - State Management 2025](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)
- [Better Stack - Zustand vs Redux vs Jotai](https://betterstack.com/community/guides/scaling-nodejs/zustand-vs-redux-toolkit-vs-jotai/)
- [FrugalTesting - Playwright vs Cypress 2025](https://www.frugaltesting.com/blog/playwright-vs-cypress-the-ultimate-2025-e2e-testing-showdown)
- [Northflank - Vercel vs Netlify 2025](https://northflank.com/blog/vercel-vs-netlify-choosing-the-deployment-platform-in-2025)

For detailed research notes and additional sources, see [background.md](./background.md).
