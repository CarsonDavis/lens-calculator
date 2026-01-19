## Lens Equivalence Converter

### Primary Inputs

**Source Side** (fully specified):
- Format (preset or custom dimensions)
- Focal length
- Aperture

**Target Side**:
- Format (preset or custom dimensions)
- Focal length (optional — pin to override default calculation)

---

### Options

**Equivalence method:**
- Diagonal (default)
- Width-match
- Height-match
- Area-based

**Match mode**:
- Blur disc (default) — match background blur relative to frame
- DOF — match depth of field limits

---

### Display

- Field of view (horizontal, vertical, diagonal)
- Visual overlay comparing sensor sizes
- Depth of field (near limit, far limit, total)
- Circle of confusion
- Blur disc size

---

### Information Panels (expandable)

Plain-english explanations of:
- Focal length equivalence between sensor sizes
- Light gathering (exposure) vs bokeh/subject separation
- Subject distance vs FOV

---

## Frontend Design

### Layout
```
┌─────────────────────────────────────────────────┐
│  [Options]  (expandable)                        │
├───────────────────────┬─────────────────────────┤
│   SOURCE              │   TARGET                │
│   ────────            │   ──────                │
│   Format [dropdown]   │   Format [dropdown]     │
│   Focal   [  50mm ]   │   Focal   [  75mm ]     │
│   Aperture [ f/1.8]   │   Aperture [ f/2.7]     │
│   Subject dist [ — ]  │                         │
│   ─────────────────   │   ─────────────────     │
│   FOV: 46.8° diag     │   FOV: 46.8° diag       │
│   DOF: —              │   DOF: —                │
│   CoC: 0.029mm        │   CoC: 0.043mm          │
│   Blur disc: —        │   Blur disc: —          │
├───────────────────────┴─────────────────────────┤
│ ┌───────────┐                                   │
│ │ ┌─────┐   │                                   │
│ │ │ src │   │  target                           │
│ │ └─────┘   │                                   │
│ └───────────┘                                   │
├─────────────────────────────────────────────────┤
│  [Information]  (expandable)                    │
└─────────────────────────────────────────────────┘
```

### Inputs
- Format: dropdown (presets + custom)
- Focal length: number input (mm)
- Aperture: number input (f-number)
- Subject distance: optional number input (source side only)
- All calculations update in real-time

### Target Override Behavior
- Target focal/aperture auto-calculated by default
- User can type a value to override → subtle font style change (e.g., italic or different weight) indicates manual override
- Deleting the value reverts to auto-calculated
- Only one field (focal or aperture) can be overridden at a time — entering a value clears the other override
- No explicit toggle needed

### Conditional Display
- DOF and blur disc only shown when subject distance is provided
- Otherwise display "—"

### Sensor Overlay
- Primary visual element, below the input panels
- Smaller sensor nested inside larger
- Both aligned to bottom-left corner
- Accurate scale comparison

---

### Format Presets

Common formats with custom entry option:
- Full frame 35mm, APS-C (Canon/Nikon/Sony), Micro Four Thirds, 1"
- Medium format: 645, 6×6, 6×7, digital MF (44×33, 54×40)
- Large format: 4×5, 8×10
- Cinema: Super 35, Super 16

### Custom Format Creation

**Trigger:** "Custom..." option at bottom of format dropdown

**Modal dialog:**
```
┌─────────────────────────────────┐
│  New Custom Format              │
│  ─────────────────              │
│  Name:   [________________]     │  (optional, defaults to "W × H mm")
│  Width:  [______] mm            │
│  Height: [______] mm            │
│                                 │
│         [Cancel]  [Save]        │
└─────────────────────────────────┘
```

**Edit/delete:** Small edit icon appears on hover next to custom formats in dropdown. Opens same modal pre-filled. Delete button in modal when editing.

---

### Options Panel

**Default state:** Collapsed

**Layout when expanded:**
```
┌─────────────────────────────────────────────────┐
│ OPTIONS                                      [−]│
├─────────────────────────────────────────────────┤
│ Equivalence   [Diagonal] [Width] [Height] [Area]│
│ Match         [Blur disc] [DOF]                 │
└─────────────────────────────────────────────────┘
```

**Controls:**
- Segmented buttons (not dropdowns) — all options visible at once
- "OPTIONS" header with chevron indicates expandability
- Defaults: Diagonal equivalence, Blur disc matching