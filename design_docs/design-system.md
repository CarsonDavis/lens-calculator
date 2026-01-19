# Design System

Visual language: clean, modern, minimalistic. Should feel effortlessly current, not trendy.

---

## Principles

1. **Quiet confidence** — Let the content breathe. No competing elements.
2. **Subtle hierarchy** — Guide the eye with spacing and weight, not color or decoration.
3. **Invisible UI** — Controls feel obvious, not designed. Nothing clever.
4. **Density without clutter** — Show information efficiently, but never cramped.

---

## Color

### Palette

Dark mode only. Neutral-first. Color is an accent, not a feature.

```
Background:     #0a0a0a
Surface:        #141414
Border:         #262626

Text primary:   #fafafa
Text secondary: #a3a3a3
Text muted:     #525252

Accent:         #3b82f6 (blue-500) — links, focus states
Error:          #ef4444 (red-500)
```

### Usage

- No gradients
- No shadows except subtle elevation on modals/dropdowns
- Borders: 1px, never heavier
- Accent color used sparingly — focus rings, active states, links

---

## Typography

### Font Stack

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

System fonts feel native and load instantly.

### Scale

| Use | Size | Weight | Tracking |
|-----|------|--------|----------|
| Body | 14px / 0.875rem | 400 | normal |
| Label | 12px / 0.75rem | 500 | 0.025em |
| Heading | 14px / 0.875rem | 600 | normal |
| Value (numbers) | 16px / 1rem | 400 | -0.01em |

### Guidelines

- All caps for labels only, with letter-spacing
- Numbers: tabular figures (`font-variant-numeric: tabular-nums`)
- No bold except headings/labels
- Line height: 1.5 for body, 1.2 for values

---

## Spacing

Base unit: 4px

| Token | Value | Use |
|-------|-------|-----|
| xs | 4px | Inline spacing, icon gaps |
| sm | 8px | Tight grouping |
| md | 16px | Default padding, gaps |
| lg | 24px | Section separation |
| xl | 32px | Major sections |

### Layout

- Consistent internal padding: 16px
- Panel gaps: 16px
- Input height: 40px
- Touch targets: minimum 44px

### Responsive Layout

Content-driven, no fixed breakpoints. Panels flow based on available width.

```css
.panel-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
```

**Behavior:**
- Side-by-side when viewport fits two 280px panels
- Stacks automatically when it can't
- No magic breakpoint numbers to maintain
- Panel min-width: 280px
- Max content width: 800px (centered on large screens)

**Full-width elements** (always span both columns):
- Options panel
- Sensor overlay
- Information panel

---

## Number Formatting

### Decimal Places

| Value | Decimals | Example |
|-------|----------|---------|
| Focal length | 0 or 1 | 50mm, 52.5mm (1 if not whole) |
| Aperture (user input) | 1 | f/1.8, f/2.0 |
| Aperture (calculated) | up to 2 | f/2.73 |
| Subject distance | 0 | 2000mm |
| FOV (degrees) | 1 | 46.8° |
| DOF distances | 0 | 1847mm |
| CoC | 3 | 0.029mm |
| Blur disc | 2 | 0.45mm |
| Blur percent | 2 | 1.25% |
| Crop factor | 2 | 1.53× |

### Distance Display

Auto-switch units for readability:

| Range | Display |
|-------|---------|
| < 1m | millimeters, no decimals (850mm) |
| 1m – 100m | meters, 1 decimal (2.5m) |
| > 100m | meters, no decimals (150m) |
| > 10km or past hyperfocal | ∞ |

### Special Values

| Situation | Display |
|-----------|---------|
| Infinity | "∞" |
| Not applicable | "—" |
| Theoretical aperture | "f/0.5 *" with footnote |

### Formatting Rules

- Aperture: "f/1.8" (plain f, not ƒ)
- Use tabular figures: `font-variant-numeric: tabular-nums`

---

## Components

### Inputs

```
- Border: 1px solid border-color
- Border radius: 6px
- Background: surface color
- No inset shadows
- Focus: 2px accent ring, no border color change
- Placeholder: muted text color
```

### Dropdowns

```
- Same styling as inputs
- Chevron icon: muted, 16px
- Options panel: surface bg, subtle shadow, 6px radius
- Hover state: slightly darker/lighter background
```

### Expandable Panels

```
- Header: text secondary, small caps label
- Chevron indicates state
- Content: no border, just spacing
- Animation: 150ms ease-out
```

### Calculated vs Override Indicator

```
- Calculated value: normal weight
- Overridden value: medium weight (500) — subtle but visible
- No color change, no icons
```

---

## Sensor Overlay (SVG)

```
- Stroke: 1px, border color
- Fill: transparent or very subtle (2-3% opacity)
- Larger format: dashed stroke
- Smaller format: solid stroke
- Labels: muted text, 11px, outside the rectangles
```

---

## Motion

- Duration: 150ms for micro-interactions, 200ms for panels
- Easing: `ease-out` for enters, `ease-in` for exits
- No bounces, no overshoots
- Prefer opacity + transform over layout shifts

---

## Anti-patterns

Avoid:

- Rounded corners > 8px (feels dated)
- Drop shadows on everything
- Colored backgrounds for sections
- Icon buttons without labels (except universal symbols)
- Hover effects that move elements
- Skeleton loaders (we're fast enough)
- Toast notifications (inline feedback instead)

---

## Tailwind Translation

```javascript
// tailwind.config.js theme extensions
{
  colors: {
    surface: 'var(--color-surface)',
    border: 'var(--color-border)',
    muted: 'var(--color-text-muted)',
  },
  borderRadius: {
    DEFAULT: '6px',
  },
  fontSize: {
    body: ['0.875rem', { lineHeight: '1.5' }],
    label: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.025em' }],
    value: ['1rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
  },
}
```

---

## Reference

Visual inspiration (not to copy, but for tone):
- Linear.app — information density, quiet UI
- Vercel dashboard — typography, spacing
- Apple Calculator — simplicity, obviousness
