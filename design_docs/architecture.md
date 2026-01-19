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

### URL State Serialization

Individual query parameters with short keys:

```
?sf=full-frame-35mm    # source format (preset ID)
&sl=50                 # source focal length (mm)
&sa=1.4                # source aperture (f-number)
&sd=2000               # source subject distance (mm, optional)
&tf=apsc-canon         # target format (preset ID)
&tl=                   # target focal length override (optional)
&ta=                   # target aperture override (optional)
&em=diagonal           # equivalence method
&mm=blur_disc          # match mode
```

**Custom formats** use width/height params instead of format ID:

```
# Custom source, preset target
?sw=43.8&sh=32.9&sn=GFX&sl=63&sa=2.8&tf=full-frame-35mm

# Preset source, custom target
?sf=full-frame-35mm&sl=50&sa=1.4&tw=43.8&th=32.9&tn=GFX
```

**Rule:** If `sf`/`tf` (format ID) present → use preset. If `sw`/`sh` or `tw`/`th` (width/height) present → use custom. Name (`sn`/`tn`) is optional.

---

## Input Validation

### Bounds

| Field | Min | Max | Notes |
|-------|-----|-----|-------|
| Focal length | 1mm | 2000mm | Covers fisheye to super-tele |
| Aperture | f/0.7 | f/128 | f/0.7 exists; f/128 for large format |
| Subject distance | focal length + 1mm | 100km | Must exceed focal length |
| Format width/height | 1mm | 500mm | Phone sensors to 8×10 |

### Behavior

- **Clamp on blur** — values corrected when input loses focus, not on keystroke
- **Brief indicator** — subtle animation when value is clamped
- **Never block** — calculations always run

### Edge Case Handling

| Situation | Behavior |
|-----------|----------|
| Subject distance ≤ focal length | Clamp to focal_length + 1mm |
| Calculated aperture < f/0.7 | Show value with "(theoretical)" note |
| Calculated aperture > f/128 | Show value with "(theoretical)" note |
| Division by zero | Cannot occur if inputs validated |

### Contextual Warnings

Display on results (not blocking):
- Near macro range: "DOF approximations less accurate at close distances"
- Theoretical aperture: "f/0.5 (theoretical — no such lens exists)"

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
