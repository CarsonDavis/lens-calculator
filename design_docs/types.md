# Data Model

## Core Types

### Format

```typescript
interface Format {
  id: string;                  // "full-frame-35mm", "apsc-canon", etc.
  name: string;                // "Full Frame 35mm"
  width: number;               // mm
  height: number;              // mm
  isCustom?: boolean;          // user-created format
}

// Derived (calculated, not stored)
interface FormatDerived {
  diagonal: number;            // mm
  area: number;                // mm²
  aspectRatio: number;         // width / height
  coc: number;                 // circle of confusion (mm)
  cropFactor: number;          // relative to 35mm
}
```

### Units

```typescript
type Unit = 'mm' | 'inches';

interface Length {
  value: number;
  unit: Unit;
}
```

---

## State Types

### Source

```typescript
interface SourceState {
  formatId: string;
  focalLength: number;         // mm (converted on input if needed)
  aperture: number;            // f-number
  subjectDistance: number | null;  // mm, optional
}

// Note: Target subject distance is derived, not stored
// s_target = s_source × (f_target / f_source)
// This maintains same framing (subject fills same portion of frame)
```

### Target

```typescript
interface TargetState {
  formatId: string;
  focalLengthOverride: number | null;   // mm, null = auto-calculate
  apertureOverride: number | null;      // f-number, null = auto-calculate
  // Invariant: at most one override can be non-null
}
```

### Options

```typescript
type EquivalenceMethod = 'diagonal' | 'width' | 'height' | 'area';
type MatchMode = 'blur_disc' | 'dof';

interface Options {
  equivalenceMethod: EquivalenceMethod;
  matchMode: MatchMode;
  displayUnit: Unit;           // for focal lengths in UI
}
```

---

## Calculated Results

### Angle of View

```typescript
interface AngleOfView {
  horizontal: number;          // degrees
  vertical: number;            // degrees
  diagonal: number;            // degrees
}
```

### Depth of Field

```typescript
interface DOFResult {
  nearLimit: number;           // mm
  farLimit: number | null;     // mm, null = infinity
  total: number | null;        // mm, null = infinite
  hyperfocal: number;          // mm
}
```

### Full Calculation Result (per side)

```typescript
interface SideResult {
  format: Format & FormatDerived;
  focalLength: number;         // mm
  aperture: number;            // f-number
  entrancePupil: number;       // mm
  aov: AngleOfView;

  // Only present if subject distance provided
  dof?: DOFResult;
  blurDisc?: number;           // mm
  blurPercent?: number;        // % of frame width
}
```

### Equivalence Result

```typescript
interface EquivalenceResult {
  source: SideResult;
  target: SideResult;
  cropFactor: number;          // target/source based on method
  isTargetFocalOverridden: boolean;
  isTargetApertureOverridden: boolean;
}
```

---

## Format Preset Data (JSON)

```typescript
// What's stored in formats.json
interface FormatPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'small' | 'medium' | 'large' | 'cinema';
}

// formats.json structure
interface FormatsFile {
  formats: FormatPreset[];
}
```

## Custom Formats (localStorage)

```typescript
// User-created formats, stored in localStorage
interface CustomFormat {
  id: string;                  // generated, e.g. "custom-1705012345"
  name: string;                // user-provided, e.g. "My Hasselblad"
  width: number;               // mm
  height: number;              // mm
}

// localStorage key: "lens-calc-custom-formats"
// Value: CustomFormat[]
```

---

## Jotai Atoms (rough shape)

```typescript
// Primitive atoms (user input)
const sourceAtom = atom<SourceState>({
  formatId: 'full-frame-35mm',
  focalLength: 50,
  aperture: 1.8,
  subjectDistance: null,
});

const targetAtom = atom<TargetState>({
  formatId: 'apsc-generic',
  focalLengthOverride: null,
  apertureOverride: null,
});

const optionsAtom = atom<Options>({
  equivalenceMethod: 'diagonal',
  matchMode: 'blur_disc',
  displayUnit: 'mm',
});

const customFormatsAtom = atom<Format[]>([]);

// Derived atoms (calculated)
const equivalenceResultAtom = atom<EquivalenceResult>((get) => {
  const source = get(sourceAtom);
  const target = get(targetAtom);
  const options = get(optionsAtom);
  const formats = get(allFormatsAtom);

  return calculateEquivalence(source, target, options, formats);
});
```

### Default State Rationale

- **Full Frame 50mm f/1.8 → APS-C**: Most common "what's my equivalent?" question
- **No subject distance**: Keeps initial view clean; DOF shown when user enters distance
- **Diagonal equivalence**: Standard crop factor calculation
- **Blur disc matching**: More intuitive than DOF for most photographers
