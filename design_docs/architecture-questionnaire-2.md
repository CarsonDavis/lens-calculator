# Architecture Questionnaire — Round 2

Follow-up decisions needed before implementation.

---

## 1. URL State Serialization

**Context:** Architecture specifies shareable URLs but no format.

### Options

**A. Individual query parameters**
```
?sf=full-frame-35mm&fl=50&ap=1.4&tf=apsc-canon&sd=2000&em=diagonal&mm=blur_disc
```
- Pros: Human-readable, easy to debug, partial state possible
- Cons: Verbose, no type safety

**B. Base64-encoded JSON**
```
?s=eyJmb3JtYXRJZCI6ImZ1bGwtZnJhbWUiLCJmb2NhbCI6NTB9
```
- Pros: Compact, handles complex state (custom formats), versioning possible
- Cons: Opaque, breaks if schema changes, can't manually edit

**C. Compact custom encoding**
```
?c=ff.50.1.4-apsc.75.2.1_d2000_dm.bd
```
- Pros: Short URLs, somewhat readable
- Cons: Custom parser needed, fragile, learning curve

**D. Hybrid: common params + encoded extras**
```
?src=full-frame-35mm&f=50&a=1.4&tgt=apsc-canon&opts=eyJ...fQ
```
- Pros: Common cases readable, complex state supported
- Cons: Two systems to maintain

### Recommendation

**Option A (Individual query parameters)** with short keys:

```
?sf=full-frame-35mm    # source format (preset ID)
&sl=50                 # source focal length
&sa=1.4                # source aperture
&sd=2000               # source subject distance (optional)
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

# Both custom
?sw=43.8&sh=32.9&sn=GFX&sl=63&sa=2.8&tw=36&th=24&tn=Custom%20FF
```

Rule: If `sf`/`tf` (format ID) present → use preset. If `sw`/`sh` or `tw`/`th` (width/height) present → use custom. Name (`sn`/`tn`) is optional.

Rationale: Photographers will want to share and tweak URLs. Human-readability matters more than compactness. Custom formats read naturally: "43.8×32.9mm called GFX" is clear at a glance.

### Decision

> reccommended looks good

---

## 2. Input Validation & Edge Cases

**Context:** No spec for invalid inputs or calculation edge cases.

### Validation Bounds

| Field | Min | Max | Notes |
|-------|-----|-----|-------|
| Focal length | 1mm | 2000mm | Covers fisheye to super-tele |
| Aperture | f/0.7 | f/128 | f/0.7 exists (Stanley Kubrick's lens), f/128 for large format |
| Subject distance | focal length + 1mm | 100km | Must be > focal length; 100km ≈ infinity for practical purposes |
| Format width/height | 1mm | 500mm | Covers phone sensors to 8x10 |

### Error Display Options

**A. Inline validation with red borders**
- Show error state on input
- Display message below field
- Block calculation until fixed

**B. Clamp to valid range silently**
- Auto-correct out-of-range values
- No error state shown
- Always calculate something

**C. Clamp with toast/indicator**
- Auto-correct values
- Brief indicator that value was adjusted
- Never blocks

**D. Allow any input, show warnings on results**
- Accept all values
- Flag suspicious results (e.g., "DOF calculation may be inaccurate at this distance")

### Recommendation

**Option C (Clamp with indicator)** for numeric bounds, **Option D (warnings)** for edge cases.

- Numeric inputs clamp to valid range on blur (not keystroke)
- Brief flash or subtle animation when clamped
- Calculations always run
- Results show contextual warnings:
  - Subject distance very close to focal length: "Near macro range — DOF approximations less accurate"
  - Calculated aperture beyond physical limits: "f/0.5 (theoretical — no such lens exists)"

Rationale: Photographers experiment. Blocking input frustrates exploration. Better to calculate and educate than refuse.


### Calculation Edge Cases

| Situation | Behavior |
|-----------|----------|
| Subject distance ≤ focal length | Clamp to focal_length + 1mm |
| Calculated aperture < f/0.7 | Show value with "(theoretical)" note |
| Calculated aperture > f/128 | Show value with "(theoretical)" note |
| Division by zero | Should never occur if inputs validated |

### Decision

> recommended is fine. we shouldn't prevent people from putting, say 2500mm, just warn if it makes sense
---

## 3. Custom Format Creation UI

**Context:** Users can create custom formats, but no UI specified.

### Options

**A. Modal dialog**
```
┌─────────────────────────────────┐
│  New Custom Format              │
│  ─────────────────              │
│  Name:   [________________]     │
│  Width:  [______] mm            │
│  Height: [______] mm            │
│                                 │
│         [Cancel]  [Save]        │
└─────────────────────────────────┘
```
- Pros: Focused task, clear entry/exit, familiar pattern
- Cons: Context switch, extra click to dismiss

**B. Inline expandable form**
- "Custom..." option in dropdown expands inline fields
- Pros: No context switch, feels lightweight
- Cons: Dropdown becomes complex, awkward if both source and target need custom

**C. Dedicated formats management section**
- Separate area/page for managing all custom formats
- Pros: Full CRUD, overview of all custom formats
- Cons: Heavier, overkill for occasional use

**D. Popover from dropdown**
- Small popover appears near dropdown when "Custom..." selected
- Pros: Contextual, lightweight, no full modal
- Cons: Positioning complexity, mobile awkward

### Recommendation

**Option A (Modal dialog)** with minimal fields:

- Name (optional, defaults to dimensions like "43.8 × 32.9mm")
- Width (mm)
- Height (mm)

Edit/delete: Long-press or right-click on custom format in dropdown shows "Edit" / "Delete" options. Or: small edit icon appears on hover next to custom formats in dropdown.

Rationale: Custom formats are an occasional power-user action. Modal is familiar and keeps the main UI clean. The dropdown shouldn't become cluttered with form fields.

### Decision

> modal is fine

---

## 4. Responsive Breakpoints & Layout

**Context:** "Mobile-first" specified but no breakpoints or layout adaptation.

### Breakpoint Options

**A. Single breakpoint (simple)**
- Mobile: < 640px (stacked)
- Desktop: ≥ 640px (side-by-side)

**B. Three breakpoints (standard)**
- Mobile: < 640px
- Tablet: 640px–1024px
- Desktop: > 1024px

**C. Content-driven (fluid)**
- No fixed breakpoints
- Side-by-side when viewport > 2× panel min-width
- Stack otherwise

### Layout Adaptation

**Mobile (stacked):**
```
┌─────────────────────┐
│  [Options]          │
├─────────────────────┤
│  SOURCE             │
│  ...                │
├─────────────────────┤
│  TARGET             │
│  ...                │
├─────────────────────┤
│  [Sensor Overlay]   │
├─────────────────────┤
│  [Information]      │
└─────────────────────┘
```

**Desktop (side-by-side):**
```
┌─────────────────────────────────┐
│  [Options]                      │
├───────────────┬─────────────────┤
│  SOURCE       │  TARGET         │
├───────────────┴─────────────────┤
│  [Sensor Overlay]               │
├─────────────────────────────────┤
│  [Information]                  │
└─────────────────────────────────┘
```

### Recommendation

**Option A (Single breakpoint)** at 640px.

- Below 640px: Stack source above target
- 640px and up: Side-by-side

Additional considerations:
- Sensor overlay scales to fit container width
- Panel min-width: 280px
- Max content width: 800px (centered on large screens)
- Touch targets remain 44px minimum on all sizes

Rationale: This app is simple enough that two states suffice. The source/target panels have identical structure, so stacking is natural. A middle "tablet" state adds complexity without clear benefit.

### Decision

> i disagree. why can we not do C?

---

## 5. Default Values

**Context:** No initial state specified.

### Options

**A. Classic comparison (FF vs APS-C)**
- Source: Full Frame, 50mm, f/1.8
- Target: APS-C (generic)
- Most common "what's the equivalent?" question

**B. Dramatic comparison (FF vs MFT)**
- Source: Full Frame, 50mm, f/1.4
- Target: Micro Four Thirds
- Shows larger crop factor difference

**C. Blank/minimal**
- Source: Full Frame, 50mm, f/2
- Target: Full Frame (same)
- User must change target to see anything interesting

**D. Medium format comparison**
- Source: Full Frame, 50mm, f/1.4
- Target: 645 medium format
- Appeals to MF-curious users

### Recommendation

**Option A (FF vs APS-C):**

```
Source:
  Format: Full Frame 35mm
  Focal length: 50mm
  Aperture: f/1.8
  Subject distance: (empty)

Target:
  Format: APS-C (generic)
  Focal length: (calculated: 75mm)
  Aperture: (calculated: f/2.7)

Options:
  Equivalence method: Diagonal
  Match mode: Blur disc
  Display unit: mm
```

Rationale: This is the most common question photographers ask: "What's my 50mm equivalent on crop?" The 50mm f/1.8 is one of the most common lenses. Starting with a meaningful comparison helps users understand the tool immediately.

### Decision

> sure let's start with that one

---

## 6. Number Formatting

**Context:** No spec for decimal places, rounding, or special values.

### Decimal Places by Value Type

| Value | Decimals | Example | Notes |
|-------|----------|---------|-------|
| Focal length | 0 or 1 | 50mm, 52.5mm | 1 decimal if not whole |
| Aperture | 1 | f/1.8, f/2.0 | Always 1 decimal |
| Subject distance | 0 | 2000mm, 5m | Switch to meters > 10000mm? |
| FOV (degrees) | 1 | 46.8° | Always 1 decimal |
| DOF distances | 0 | 1847mm | Precision is false anyway |
| CoC | 3 | 0.029mm | Standard convention |
| Blur disc | 2 | 0.45mm | 2 decimals |
| Blur percent | 2 | 1.25% | 2 decimals |
| Crop factor | 2 | 1.53× | 2 decimals |

### Distance Display Options

**A. Always millimeters**
- Simple, consistent
- Large numbers awkward (2000000mm)

**B. Auto-switch units**
- < 1000mm: show mm
- 1000mm–100000mm: show meters (1 decimal)
- > 100000mm: show km or "∞"

**C. User-selected unit**
- Add distance unit to options
- mm / m / ft / in

### Special Values

| Situation | Display |
|-----------|---------|
| Infinity (DOF far limit) | "∞" |
| Not applicable (no subject distance) | "—" |
| Theoretical aperture | "f/0.5 *" with footnote |

### Recommendation

**Option B (Auto-switch)** for distances, table above for decimals.

Display rules:
- Distances < 1m: millimeters, no decimals (e.g., "850mm")
- Distances 1m–100m: meters, 1 decimal (e.g., "2.5m")
- Distances > 100m: meters, no decimals (e.g., "150m")
- Approaching infinity (> 10km or hyperfocal exceeded): "∞"

Aperture: Always show one decimal place, displayed as "f/1.8" not "ƒ/1.8" (plain f is more accessible).

Rationale: Photographers think in meters for typical distances. Showing "2500mm" when "2.5m" is clearer adds cognitive load. The auto-switch keeps numbers human-scale.

### Decision

> recommendation is good, however if the calculated aperature has a decimal, we should display up to 2 decimals

---

## 7. Digital Medium Format Sensors

**Context:** formats.md has film MF but not digital MF sensors.

### Current Digital MF Sensors

| Camera System | Width (mm) | Height (mm) | Notes |
|---------------|------------|-------------|-------|
| Fujifilm GFX | 43.8 | 32.9 | "GFX 100 MP" sensor |
| Hasselblad X/XCD | 43.8 | 32.9 | Same as GFX |
| Phase One / Hasselblad H | 53.4 | 40.0 | "Full frame" digital MF |
| Pentax 645Z | 43.8 | 32.8 | Slightly different from GFX |

### Options

**A. Add all as separate entries**
- Fujifilm GFX 100
- Hasselblad X2D
- Phase One IQ4
- etc.

**B. Add generic sizes**
- "Digital MF (44×33)" — covers GFX, Hasselblad X, Pentax
- "Digital MF (54×40)" — covers Phase One, Hasselblad H

**C. Add by sensor size name**
- "Medium Format 44×33"
- "Medium Format 54×40"

### Recommendation

**Option C (by sensor size)** with note:

```
Medium Format:
  - 645 (6×4.5) — film
  - 6×6 — film
  - 6×7 — film
  - Digital MF 44×33 (Fuji GFX, Hasselblad X)
  - Digital MF 54×40 (Phase One, Hasselblad H)
```

Rationale: Sensor sizes matter more than brand names for equivalence calculations. Grouping by size with parenthetical examples is clearest. Brand names help users find their camera.

### Decision

> rec is good

---

## 8. Options Panel Behavior

**Context:** Options panel exists but behavior not specified.

### Default State Options

**A. Collapsed by default**
- Cleaner initial view
- Power users know to expand
- Most users won't need to change defaults

**B. Expanded by default**
- All options visible immediately
- No hidden functionality
- More cluttered

**C. Collapsed on mobile, expanded on desktop**
- Saves mobile space
- Desktop has room

### Panel Contents

Current options from requirements:
1. Equivalence method (diagonal/width/height/area)
2. Match mode (blur disc/DOF)

Additional options to consider:
3. Display unit (mm/inches) — specified in types.md
4. Distance unit (mm/m/ft) — if we add this

### Control Types

**A. Dropdown for each**
```
Equivalence: [Diagonal     ▼]
Match mode:  [Blur disc    ▼]
```

**B. Segmented buttons**
```
Equivalence: [Diag] [Width] [Height] [Area]
Match mode:  [Blur] [DOF]
```

**C. Radio groups**
```
Equivalence
  ○ Diagonal  ○ Width  ○ Height  ○ Area

Match mode
  ○ Blur disc  ○ Depth of field
```

### Recommendation

**Collapsed by default**, with **segmented buttons** for options.

Layout when expanded:
```
┌─────────────────────────────────────────────────┐
│ OPTIONS                                      [−]│
├─────────────────────────────────────────────────┤
│ Equivalence   [Diagonal] [Width] [Height] [Area]│
│ Match         [Blur disc] [DOF]                 │
└─────────────────────────────────────────────────┘
```

- Collapsed by default (most users want diagonal + blur disc)
- Segmented buttons give immediate visibility of all options
- No need for display unit toggle (always mm for this audience)
- "OPTIONS" header with chevron indicates expandability

Rationale: The defaults (diagonal, blur disc) are correct for 90% of use cases. Advanced users will explore. Segmented buttons are faster than dropdowns and show all choices at once.

### Decision

> rec is good

---

## 9. Info Panel Content (TODOs)

**Context:** Three sections in info-content.md marked TODO.

This is content writing rather than architecture, but for completeness:

### Focal Length Equivalence

Should explain:
- Why 50mm on crop "looks like" 75mm on full frame
- Field of view is what changes, not perspective
- Perspective only changes with distance

### Light Gathering vs Bokeh

Should explain:
- f/1.8 gathers the same light on any format (exposure equivalence)
- f/1.8 on crop has less blur than f/1.8 on full frame (bokeh equivalence)
- "Equivalent aperture" for blur ≠ equivalent aperture for exposure
- Total light gathered depends on sensor area × lens aperture

### DOF vs Blur Disc

Should explain:
- DOF = range of acceptable sharpness (near to far limit)
- Blur disc = how blurry the background is (at a specific distance)
- Usually coupled, but can diverge when focal lengths don't match
- Example: 50mm at f/4 and 100mm at f/8 have similar DOF but different blur character

### Recommendation

Draft this content separately. Keep explanations short (3-4 sentences each). Use concrete examples with specific numbers. Avoid jargon where possible.

### Decision

> i wrote this out separately. no need to worry about this.

---

## Summary of Recommendations

| Topic | Recommendation |
|-------|----------------|
| URL format | Individual query params with short keys |
| Validation | Clamp on blur + contextual warnings |
| Custom formats | Modal dialog, minimal fields |
| Breakpoints | Single at 640px |
| Defaults | FF 50mm f/1.8 → APS-C |
| Number formatting | Auto-switch distance units, table for decimals |
| Digital MF | Add as sensor sizes with brand examples |
| Options panel | Collapsed default, segmented buttons |
| Info content | Draft separately, keep brief |
