# Modern React Web Development Stack

**Date:** January 2026

---

## Technology Stack Overview

| Category | Technology | Version |
|----------|------------|---------|
| Build Tool | Vite | 6.x |
| Language | TypeScript | 5.x |
| UI Framework | React | 18.x |
| Styling | Tailwind CSS | 3.x |
| State Management | Jotai | 2.x |
| Server State | TanStack Query | 5.x |
| Routing | React Router | 6.x |
| Testing (Unit) | Vitest | 2.x |
| Testing (Component) | React Testing Library | 16.x |
| Testing (E2E) | Playwright | 1.x |
| Linting | ESLint | 9.x |
| Formatting | Prettier | 3.x |
| Pre-commit | Lefthook | 1.x |
| Maps (optional) | react-map-gl + MapboxGL | 7.x / 3.x |

---

## 1. Build Tooling

### Vite

Vite provides the development server and production bundler.

**Installation:**
```bash
npm create vite@latest my-project -- --template react-ts
```

**Key Configuration** (`vite.config.ts`):
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

**Path Aliases** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"]
    }
  }
}
```

---

## 2. TypeScript Configuration

Use strict mode for maximum type safety.

**Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx",
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

---

## 3. Styling with Tailwind CSS

Tailwind provides utility-first CSS with zero runtime overhead.

**Installation:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configuration** (`tailwind.config.js`):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
};
```

**Global Styles** (`src/index.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-background: #ffffff;
    --color-foreground: #1f2937;
  }

  [data-theme='dark'] {
    --color-background: #111827;
    --color-foreground: #f9fafb;
  }
}
```

**Component Example:**
```tsx
function Button({ children, variant = 'primary' }) {
  const styles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
```

---

## 4. State Management

### Jotai (Client State)

Jotai uses an atomic model where state is composed from small, independent atoms.

**Installation:**
```bash
npm install jotai jotai-devtools
```

**Basic Atoms:**
```typescript
// src/features/map-explorer/atoms/map-atoms.ts
import { atom } from 'jotai';

// Primitive atom
export const viewportAtom = atom({
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 10,
});

// Derived atom (read-only, computed from other atoms)
export const zoomLevelAtom = atom((get) => {
  const viewport = get(viewportAtom);
  if (viewport.zoom < 5) return 'world';
  if (viewport.zoom < 10) return 'region';
  return 'local';
});

// Writable derived atom
export const centerAtom = atom(
  (get) => {
    const { latitude, longitude } = get(viewportAtom);
    return { latitude, longitude };
  },
  (get, set, newCenter: { latitude: number; longitude: number }) => {
    const viewport = get(viewportAtom);
    set(viewportAtom, { ...viewport, ...newCenter });
  }
);
```

**Atom with URL Sync:**
```typescript
// For shareable URLs
import { atomWithLocation } from 'jotai-location';

export const locationAtom = atomWithLocation();
```

**Usage in Components:**
```tsx
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { viewportAtom, zoomLevelAtom } from './atoms/map-atoms';

function MapControls() {
  // Read and write
  const [viewport, setViewport] = useAtom(viewportAtom);

  // Read-only (more efficient)
  const zoomLevel = useAtomValue(zoomLevelAtom);

  // Write-only
  const setViewportOnly = useSetAtom(viewportAtom);

  return (
    <div>
      <p>Current zoom level: {zoomLevel}</p>
      <button onClick={() => setViewport({ ...viewport, zoom: viewport.zoom + 1 })}>
        Zoom In
      </button>
    </div>
  );
}
```

### TanStack Query (Server State)

Use TanStack Query for all server data fetching, caching, and synchronization.

**Installation:**
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**Setup:**
```tsx
// src/app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </JotaiProvider>
    </QueryClientProvider>
  );
}
```

**Query Hook:**
```typescript
// src/features/datasets/hooks/use-datasets.ts
import { useQuery } from '@tanstack/react-query';

interface Dataset {
  id: string;
  name: string;
  description: string;
}

async function fetchDatasets(): Promise<Dataset[]> {
  const response = await fetch('/api/datasets');
  if (!response.ok) throw new Error('Failed to fetch datasets');
  return response.json();
}

export function useDatasets() {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: fetchDatasets,
  });
}
```

---

## 5. Project Structure

Organize by feature with shared utilities.

```
src/
├── app/                        # Application shell
│   ├── App.tsx                 # Root component
│   ├── routes.tsx              # Route definitions
│   └── providers.tsx           # Context providers (Jotai, Query)
│
├── features/                   # Feature modules (self-contained)
│   ├── map-explorer/
│   │   ├── atoms/              # Jotai atoms for this feature
│   │   │   └── map-atoms.ts
│   │   ├── components/         # Feature-specific components
│   │   │   ├── MapView.tsx
│   │   │   └── LayerPanel.tsx
│   │   ├── hooks/              # Feature-specific hooks
│   │   │   └── use-map-layers.ts
│   │   ├── types.ts            # Feature types
│   │   └── index.ts            # Public exports
│   │
│   ├── datasets/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   └── auth/
│       ├── atoms/
│       ├── components/
│       └── index.ts
│
├── shared/                     # Cross-feature utilities
│   ├── components/             # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── hooks/                  # Generic hooks
│   │   └── use-debounce.ts
│   ├── utils/                  # Utility functions
│   │   └── format.ts
│   └── types/                  # Shared type definitions
│       └── api.ts
│
├── test/                       # Test utilities
│   └── setup.ts
│
└── main.tsx                    # Entry point
```

**Feature Module Pattern:**

Each feature exports only its public API via `index.ts`:

```typescript
// src/features/map-explorer/index.ts
export { MapView } from './components/MapView';
export { useMapLayers } from './hooks/use-map-layers';
export { viewportAtom, zoomLevelAtom } from './atoms/map-atoms';
export type { Viewport, MapLayer } from './types';
```

**Import Rules:**
- Features import from `@shared/*` only
- Features never import directly from other features
- App layer imports from features and shared

---

## 6. Linting & Formatting

### ESLint 9 (Flat Config)

**Installation:**
```bash
npm install -D eslint @eslint/js typescript-eslint \
  eslint-plugin-react eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y eslint-config-prettier \
  eslint-plugin-inclusive-language @eslint-community/eslint-plugin-eslint-comments
```

**Configuration** (`eslint.config.mjs`):
```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import inclusiveLanguage from 'eslint-plugin-inclusive-language';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'inclusive-language': inclusiveLanguage,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Accessibility
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',

      // Inclusive language
      'inclusive-language/use-inclusive-words': 'warn',

      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  prettier
);
```

### Prettier

**Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 90,
  "jsxSingleQuote": false,
  "bracketSpacing": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Installation:**
```bash
npm install -D prettier prettier-plugin-tailwindcss
```

---

## 7. Pre-commit Hooks with Lefthook

Lefthook runs checks before commits with native parallel execution.

**Installation:**
```bash
npm install -D lefthook
npx lefthook install
```

**Configuration** (`lefthook.yml`):
```yaml
pre-commit:
  parallel: true
  commands:
    typecheck:
      glob: '*.{ts,tsx}'
      run: npx tsc --noEmit
    lint:
      glob: '*.{ts,tsx,js,jsx}'
      run: npx eslint {staged_files}
    format:
      glob: '*.{ts,tsx,js,jsx,json,css,md}'
      run: npx prettier --check {staged_files}

pre-push:
  commands:
    test:
      run: npm test
```

---

## 8. Testing

### Vitest (Unit & Component Testing)

**Installation:**
```bash
npm install -D vitest jsdom @testing-library/react \
  @testing-library/jest-dom @testing-library/user-event
```

**Setup** (`src/test/setup.ts`):
```typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

**Component Test Example:**
```typescript
// src/features/auth/components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits with valid credentials', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });

  it('shows error for invalid email', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'invalid');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });
});
```

**Testing Jotai Atoms:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAtom } from 'jotai';
import { viewportAtom } from './map-atoms';

describe('viewportAtom', () => {
  it('updates viewport state', () => {
    const { result } = renderHook(() => useAtom(viewportAtom));

    act(() => {
      result.current[1]({ latitude: 51.5, longitude: -0.1, zoom: 12 });
    });

    expect(result.current[0]).toEqual({
      latitude: 51.5,
      longitude: -0.1,
      zoom: 12,
    });
  });
});
```

### Playwright (E2E Testing)

**Installation:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Configuration** (`playwright.config.ts`):
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**E2E Test Example:**
```typescript
// e2e/map-explorer.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Map Explorer', () => {
  test('loads map and displays layers panel', async ({ page }) => {
    await page.goto('/map');

    await expect(page.getByTestId('map-container')).toBeVisible();
    await expect(page.getByRole('heading', { name: /layers/i })).toBeVisible();
  });

  test('can toggle layer visibility', async ({ page }) => {
    await page.goto('/map');

    const layerToggle = page.getByRole('switch', { name: /satellite/i });
    await layerToggle.click();

    await expect(layerToggle).toBeChecked();
  });
});
```

---

## 9. Environment Variables

**Files:**
```
.env                  # Default values (committed)
.env.local            # Local overrides (gitignored)
.env.production       # Production values (gitignored or in CI)
.env.example          # Template for developers (committed)
```

**Vite Variables** (must be prefixed with `VITE_`):
```bash
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_MAPBOX_TOKEN=your_token_here
VITE_ENABLE_DEVTOOLS=true
```

**Usage:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Type-safe env (src/vite-env.d.ts)
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 10. Mapping (Optional)

For geospatial applications, use react-map-gl with MapboxGL.

**Installation:**
```bash
npm install react-map-gl mapbox-gl
npm install -D @types/mapbox-gl
```

**Basic Map Component:**
```tsx
// src/features/map-explorer/components/MapView.tsx
import { useCallback } from 'react';
import Map, { NavigationControl, ViewStateChangeEvent } from 'react-map-gl';
import { useAtom } from 'jotai';
import { viewportAtom } from '../atoms/map-atoms';
import 'mapbox-gl/dist/mapbox-gl.css';

export function MapView() {
  const [viewport, setViewport] = useAtom(viewportAtom);

  const handleMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      setViewport(evt.viewState);
    },
    [setViewport]
  );

  return (
    <Map
      {...viewport}
      onMove={handleMove}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: '100%', height: '100%' }}
    >
      <NavigationControl position="top-right" />
    </Map>
  );
}
```

---

## 11. Package Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint src",
    "lint:fix": "eslint src --fix",
    "format": "prettier --write src",
    "format:check": "prettier --check src",
    "typecheck": "tsc --noEmit",
    "prepare": "lefthook install"
  }
}
```

---

## Quick Start

```bash
# Create project
npm create vite@latest my-project -- --template react-ts
cd my-project

# Install core dependencies
npm install jotai @tanstack/react-query react-router-dom

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-config-prettier eslint-plugin-inclusive-language
npm install -D prettier prettier-plugin-tailwindcss
npm install -D lefthook

# Initialize tools
npx tailwindcss init -p
npx playwright install
npx lefthook install

# Optional: mapping
npm install react-map-gl mapbox-gl
```

---

## Summary

| Need | Solution |
|------|----------|
| Bundle & serve | Vite |
| Type safety | TypeScript 5.x strict |
| Styling | Tailwind CSS |
| Client state | Jotai atoms |
| Server state | TanStack Query |
| Routing | React Router |
| Unit tests | Vitest + React Testing Library |
| E2E tests | Playwright |
| Linting | ESLint 9 flat config |
| Formatting | Prettier |
| Pre-commit | Lefthook |
| Maps | react-map-gl + MapboxGL |
