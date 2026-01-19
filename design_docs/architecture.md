# Architecture Decisions

## Structure

### Calculation Engine
- **Separate package** — standalone module, no UI dependencies
- Fully testable in isolation
- Supports **metric and imperial** units (mm, inches)

### Format Data
- Loaded from **separate JSON file**, not hardcoded
- Custom formats persisted to **localStorage**
- Users can save/name custom formats (keep it minimal and clean)

---

## State Management

### Data Flow
- Recalculate derived values on every render (no memoization needed)
- Unidirectional: inputs → calculation engine → display

### Override Tracking
```
{
  value: number,
  isOverridden: boolean
}
```
- `isOverridden` drives CSS styling (subtle font change)
- Clearing the field sets `isOverridden: false`, reverts to calculated

### Source vs Target Shape
- **Different structures** — source has subject distance, target has override flags
- Can consolidate later if they converge

---

## Persistence

| What | Where |
|------|-------|
| Current state | URL (shareable links) |
| Last session | localStorage |
| Custom formats | localStorage |
| User accounts | None |

---

## Platform & Deployment

- **Static site** — no backend required
- Host on GitHub Pages / Netlify / Vercel
- **Mobile-first** responsive design
- No analytics, no PWA

---

## Testing

| Type | Coverage |
|------|----------|
| Unit tests | Calculation engine |
| E2E tests | UI flows |
| Visual regression | Sensor overlay |

---

## Accessibility

- **Full WCAG compliance**
- Keyboard navigation throughout
- Proper ARIA labels, focus states, contrast

---

## Rendering

### Sensor Overlay
- **SVG** — scalable, styleable, accessible
- Smaller format nested inside larger
- Bottom-left justified

---

## Not Doing

- Server/backend
- User accounts / cloud sync
- Analytics
- PWA / offline
- Plugin system
- Embed API

---

## Project Structure

```
src/
├── calc/                   # Pure TS calculation engine (no React)
│   ├── equivalence.ts      # Focal/aperture equivalence
│   ├── dof.ts              # Depth of field
│   ├── blur.ts             # Blur disc
│   ├── format.ts           # Format utilities (diagonal, CoC, etc.)
│   ├── units.ts            # mm/inch conversions
│   ├── types.ts            # Shared types
│   └── index.ts            # Public exports
│
├── components/             # React components
│   ├── SourcePanel.tsx
│   ├── TargetPanel.tsx
│   ├── SensorOverlay.tsx   # SVG visualization
│   ├── OptionsPanel.tsx
│   ├── InfoPanel.tsx
│   └── ...
│
├── atoms/                  # Jotai state
│   ├── source.ts
│   ├── target.ts
│   ├── options.ts
│   └── derived.ts          # Calculated values
│
├── data/
│   └── formats.json        # Format presets
│
├── App.tsx
└── main.tsx
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Build | Vite |
| Language | TypeScript |
| UI | React |
| Styling | Tailwind CSS |
| State | Jotai |
| Unit/Component Tests | Vitest + React Testing Library |
| E2E Tests | Playwright |
| Linting | ESLint 9 + Prettier |
| Pre-commit | Lefthook |

### Not Using
- TanStack Query (no server state)
- React Router (single page)

---

## Visual Design

See **design-system.md** for complete visual language.

Key points:
- Dark mode only
- Neutral palette, accent color used sparingly
- System fonts, 14px base
- 4px spacing scale
- Clean, minimal, no heavy shadows or decorations
