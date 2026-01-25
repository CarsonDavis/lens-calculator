# Calculation Module

Pure TypeScript calculation engine for lens equivalence, depth of field, and blur disc calculations. No UI dependencies.

## Installation

```bash
npm install
```

## Usage

### Basic Equivalence Calculation

```typescript
import { calculateEquivalence } from './calc';
import type { SourceState, TargetState, Options, Format } from './calc';

const formats: Format[] = [
  { id: 'full-frame', name: 'Full Frame', width: 36, height: 24 },
  { id: 'apsc', name: 'APS-C', width: 22.5, height: 15 },
];

const source: SourceState = {
  formatId: 'full-frame',
  focalLength: 50, // mm
  aperture: 1.4, // f-number
  subjectDistance: 2000, // mm (optional, set to null if not needed)
};

const target: TargetState = {
  formatId: 'apsc',
  focalLengthOverride: null, // null = auto-calculate equivalent
  apertureOverride: null, // null = auto-calculate equivalent
};

const options: Options = {
  equivalenceMethod: 'diagonal', // or 'width', 'height', 'area'
  matchMode: 'blur_disc', // or 'dof'
  displayUnit: 'mm',
};

const result = calculateEquivalence({ source, target, options, formats });

console.log(result.target.focalLength); // ~31.25mm (equivalent focal length)
console.log(result.target.aperture); // ~0.875 (equivalent aperture)
console.log(result.cropFactor); // ~0.625 (APS-C relative to FF)
```

### Individual Calculations

```typescript
import {
  calculateDiagonal,
  calculateCoC,
  calculateCropFactor,
  calculateAOV,
  calculateDOF,
  calculateBlurDisc,
  calculateBlurPercent,
  withDerived,
} from './calc';

// Format utilities
const diagonal = calculateDiagonal(36, 24); // 43.27mm
const coc = calculateCoC(diagonal); // 0.0288mm
const cropFactor = calculateCropFactor(diagonal); // 1.0

// Angle of view
const format = withDerived({ id: 'ff', name: 'FF', width: 36, height: 24 });
const aov = calculateAOV(format, 50);
// { horizontal: 39.6°, vertical: 27.0°, diagonal: 46.8° }

// Depth of field
const dof = calculateDOF(50, 1.4, coc, 2000);
// { nearLimit, farLimit, total, hyperfocal }

// Blur disc
const blur = calculateBlurDisc(50, 1.4, 2000); // 0.893mm
const blurPct = calculateBlurPercent(blur, 36); // 2.48%
```

## API Reference

### Main Function

#### `calculateEquivalence(input)`

Calculates full equivalence between source and target formats.

**Input:**

- `source: SourceState` — Source format, focal length, aperture, optional subject distance
- `target: TargetState` — Target format with optional overrides
- `options: Options` — Equivalence method and match mode
- `formats: Format[]` — Available format definitions

**Returns:** `EquivalenceResult` with complete calculations for both sides.

### Calculation Situations

The module handles six situations based on what's overridden:

| Situation | Override                 | Calculates                           |
| --------- | ------------------------ | ------------------------------------ |
| 1         | None                     | Equivalent focal length and aperture |
| 2         | None + subject distance  | Adds DOF and blur calculations       |
| 3         | Focal length (blur mode) | Aperture to match blur %             |
| 4         | Focal length (DOF mode)  | Aperture to match DOF                |
| 5         | Aperture (blur mode)     | Focal length to match blur %         |
| 6         | Aperture (DOF mode)      | Focal length for best DOF match      |

### Format Utilities

| Function                        | Description                  |
| ------------------------------- | ---------------------------- |
| `calculateDiagonal(w, h)`       | Sensor diagonal in mm        |
| `calculateCoC(diagonal)`        | Circle of confusion (d/1500) |
| `calculateCropFactor(diagonal)` | Crop factor relative to 35mm |
| `calculateArea(w, h)`           | Sensor area in mm²           |
| `withDerived(format)`           | Add derived values to format |

### Optical Calculations

| Function                            | Description                          |
| ----------------------------------- | ------------------------------------ |
| `calculateAOV(format, focalLength)` | Angle of view (h, v, diagonal)       |
| `calculateEntrancePupil(f, N)`      | Entrance pupil diameter (f/N)        |
| `calculateHyperfocal(f, N, coc)`    | Hyperfocal distance                  |
| `calculateDOF(f, N, coc, s)`        | Full DOF result                      |
| `calculateBlurDisc(f, N, s)`        | Blur disc for background at infinity |
| `calculateBlurPercent(blur, width)` | Blur as % of frame                   |

### Unit Conversions

| Function                | Description                |
| ----------------------- | -------------------------- |
| `mmToInches(mm)`        | Convert mm to inches       |
| `inchesToMm(inches)`    | Convert inches to mm       |
| `degreesToRadians(deg)` | Convert degrees to radians |
| `radiansToDegrees(rad)` | Convert radians to degrees |

## Key Formulas

### Scaling Factor Between Formats

```
diagonal: SF = d_target / d_source
width:    SF = w_target / w_source
height:   SF = h_target / h_source
area:     SF = sqrt(area_target / area_source)
```

**Note:** This is the target/source ratio used for scaling calculations, not the traditional "crop factor". Traditional crop factor is FF/smaller (e.g., 1.6 for APS-C). This scaling factor is the inverse when going from larger to smaller format (e.g., 0.625 for FF→APS-C).

### Equivalence (same FOV + same DOF/blur)

```
f_target = f_source × CF
N_target = N_source × CF
```

### Depth of Field

```
Hyperfocal:  H = f² / (N × CoC) + f
Near limit:  D_near = (H × s) / (H + s - f)
Far limit:   D_far = (H × s) / (H - s + f)  [∞ if denominator ≤ 0]
```

### Blur Disc

```
Blur (infinity background): B = f² / (N × (s - f))
Blur (specific distance):   B = (f/N) × (f/(s-f)) × |1 - s/s_bg|
Blur percent: B / width × 100
```

## Subject Distance Scaling

For **default equivalence** (Situations 1-2, no overrides), subject distance is the **same** on both sides. Equivalent focal lengths produce the same FOV, so the same distance gives the same framing and matching blur percentage.

For **blur override situations** (Situations 3 & 5), subject distance scales to maintain framing (subject fills same proportion of frame width):

```
s_target = s_source × (f_target / f_source) × (w_source / w_target)
```

This leads to simplified blur matching formulas:

```
Aperture for blur match: N_target = N_source × (f_target / f_source)
Focal for blur match:    f_target = f_source × (N_target / N_source)
```

These ensure consistency: when the override value equals the equivalent, the result matches default equivalence.

For **DOF override situations** (Situations 4 & 6), diagonal-based equivalence is used since DOF depends on CoC which scales with diagonal.

## Testing

```bash
npm run test:run   # Run all tests once
npm test           # Watch mode
npm run typecheck  # Type checking only
```

76 unit tests cover all calculations including edge cases (infinity DOF, theoretical apertures).

## File Structure

```
src/calc/
├── types.ts        # Type definitions and validation constants
├── units.ts        # Unit conversions
├── format.ts       # Format-derived calculations
├── aov.ts          # Angle of view
├── dof.ts          # Depth of field
├── blur.ts         # Blur disc
├── equivalence.ts  # Equivalence calculations (6 situations)
├── calculate.ts    # Main orchestration
├── index.ts        # Public exports
└── *.test.ts       # Unit tests
```
