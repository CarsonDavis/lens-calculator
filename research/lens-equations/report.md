# Camera Format Equivalence: Complete Mathematical System

A comprehensive system of equations for converting between camera formats, calculating depth of field, and understanding the optical relationships between sensor size, focal length, and aperture.

## Executive Summary

Camera format equivalence allows photographers to predict how images will look across different sensor/film sizes. The key insight: **depth of field and background blur depend on the physical aperture diameter, not the f-number**. Two systems with the same entrance pupil diameter, same subject distance, and same framing will produce identical depth of field regardless of sensor size.

For quick conversions between formats:
- **Equivalent focal length** = focal_length × (target_diagonal / source_diagonal)
- **Equivalent f-number** (for same DOF) = f_number × (target_diagonal / source_diagonal)
- **Equivalent ISO** (for same noise) = ISO × (target_diagonal / source_diagonal)²

---

## Part 1: Fundamental Definitions

### 1.1 Sensor Diagonal and Crop Factor

**Sensor diagonal from dimensions:**
```
d = sqrt(w² + h²)
```

**Crop factor (relative to full-frame 35mm):**
```
CF = 43.27 / d
```
where 43.27mm is the diagonal of full-frame 35mm (36×24mm).

**General crop factor between any two formats:**
```
CF_A→B = d_B / d_A
```

### 1.2 Dimensions from Diagonal and Aspect Ratio

For aspect ratio w:h, given diagonal d:
```
width  = d × w / sqrt(w² + h²)
height = d × h / sqrt(w² + h²)
```

| Aspect Ratio | Width Factor | Height Factor |
|--------------|--------------|---------------|
| 3:2          | 0.8321       | 0.5547        |
| 4:3          | 0.8000       | 0.6000        |
| 16:9         | 0.8719       | 0.4903        |
| 1:1          | 0.7071       | 0.7071        |
| 6:7          | 0.6508       | 0.7593        |

### 1.3 F-Number and Entrance Pupil

**F-number definition:**
```
N = f / D
```
where:
- N = f-number
- f = focal length
- D = entrance pupil diameter

**Entrance pupil diameter:**
```
D = f / N
```

---

## Part 2: Focal Length Equivalence

### 2.1 Equivalent Focal Length (Same Field of View)

**Between any two formats:**
```
f_target = f_source × (d_target / d_source)
```

**To 35mm equivalent:**
```
f_35mm_equiv = f_actual × CF
```

**From 35mm to target format:**
```
f_target = f_35mm / CF_target
```

### 2.2 Angle of View

**Horizontal angle of view:**
```
AOV_h = 2 × arctan(w / (2 × f))
```

**Vertical angle of view:**
```
AOV_v = 2 × arctan(h / (2 × f))
```

**Diagonal angle of view:**
```
AOV_d = 2 × arctan(d / (2 × f))
```

---

## Part 3: Circle of Confusion

### 3.1 CoC Limit (Acceptable Blur Threshold)

**Zeiss formula (d/1730):**
```
CoC = d / 1730
```

**Modern standard (d/1500):**
```
CoC = d / 1500
```

**Full formula with viewing conditions:**
```
CoC = (viewing_distance_cm / 25) / (resolution_lp_mm × enlargement × 2)
```

Standard assumptions: 25cm viewing, 5 lp/mm acuity, enlargement to ~30cm diagonal print.

### 3.2 Common CoC Values (d/1500)

| Format              | Dimensions (mm) | Diagonal | CoC (mm) |
|---------------------|-----------------|----------|----------|
| 1" sensor           | 13.2 × 8.8      | 15.9     | 0.011    |
| Micro Four Thirds   | 17.3 × 13.0     | 21.6     | 0.014    |
| APS-C (Canon)       | 22.3 × 14.9     | 26.8     | 0.018    |
| APS-C (Nikon/Sony)  | 23.6 × 15.6     | 28.3     | 0.019    |
| Full Frame 35mm     | 36 × 24         | 43.3     | 0.029    |
| 645 film            | 56 × 41.5       | 69.7     | 0.046    |
| 6×6 film            | 56 × 56         | 79.2     | 0.053    |
| 6×7 film            | 56 × 67         | 87.3     | 0.058    |
| 4×5 sheet           | 102 × 127       | 163      | 0.109    |
| 8×10 sheet          | 203 × 254       | 325      | 0.217    |

### 3.3 Actual Blur Circle Size

For an out-of-focus object at distance S₂ when focused at S₁:

**General formula:**
```
c = A × |S₂ - S₁| / S₂ × f / (S₁ - f)
```

**In terms of f-number:**
```
c = |S₂ - S₁| / S₂ × f² / (N × (S₁ - f))
```

**Object at infinity, focused at S₁:**
```
c = f² / (N × (S₁ - f))
```

**Focused at infinity, object at S₂:**
```
c = f² / (N × S₂)
```

---

## Part 4: Depth of Field Equations

### 4.1 Hyperfocal Distance

**Primary formula:**
```
H = f² / (N × c)
```

**With focal length correction (more precise):**
```
H = f² / (N × c) + f
```

When focused at H, everything from H/2 to infinity is acceptably sharp.

### 4.2 Near and Far Limits

**Near limit of acceptable sharpness:**
```
D_n = (H × s) / (H + s - f)
```

**Far limit of acceptable sharpness:**
```
D_f = (H × s) / (H - s + f)
```
If (H - s + f) ≤ 0, then D_f = ∞

**Alternative formulation:**
```
D_n = (s × f²) / (f² + N × c × (s - f))
D_f = (s × f²) / (f² - N × c × (s - f))
```

### 4.3 Total Depth of Field

**General:**
```
DOF = D_f - D_n
```

**Approximation for distant subjects (s >> f):**
```
DOF ≈ 2 × N × c × s² / f²
```

**In terms of magnification (for macro):**
```
DOF = 2 × N × c × (m + 1) / m²
```

At high magnification (m >> 1):
```
DOF ≈ 2 × N × c / m
```

### 4.4 Key DOF Relationships

- DOF ∝ N (linear with f-number)
- DOF ∝ c (linear with CoC)
- DOF ∝ s² (quadratic with subject distance)
- DOF ∝ 1/f² (inverse quadratic with focal length)
- DOF ∝ 1/m (inverse linear with magnification, at high m)

---

## Part 5: Aperture Equivalence

### 5.1 Core Principle

**DOF depends on entrance pupil diameter, not f-number.**

For equivalent DOF between two systems with equivalent field of view:
```
D_1 = D_2
f_1 / N_1 = f_2 / N_2
```

### 5.2 Equivalent Aperture Formula

**For same DOF:**
```
N_target = N_source × (d_target / d_source)
N_target = N_source × (f_target / f_source)  [when matching FOV]
```

**To 35mm equivalent f-number:**
```
N_35mm_equiv = N_actual × CF
```

### 5.3 Exposure vs DOF

**Exposure (light per unit area):**
- Depends on f-number only
- Same f-number = same exposure, regardless of sensor size

**Total light gathered:**
- Depends on f-number AND sensor area
- Same entrance pupil = same total light

**Equivalent ISO (for same noise characteristics):**
```
ISO_target = ISO_source × (d_target / d_source)²
```

---

## Part 6: Background Blur (Bokeh)

### 6.1 Blur Disc Diameter

Background blur is NOT the same as depth of field!

**General formula (blur disc in image plane):**
```
B = (f / N) × m × |1 - S / S_b|
```

where:
- B = blur disc diameter
- f = focal length
- N = f-number
- m = magnification at focus distance
- S = subject distance (focused)
- S_b = background distance

**Simplified (background at infinity):**
```
B = (f / N) × m = f² / (N × S)
```

### 6.2 Background Blur Relationships

- Blur ∝ 1/N (wider aperture = more blur)
- Blur ∝ f (longer focal length = more blur, for distant backgrounds)
- Blur ∝ 1/S (closer subject = more blur)
- Blur ∝ (S_b - S)/S_b (greater separation = more blur)

### 6.3 Blur as Percentage of Frame

To compare blur across formats, express as fraction of frame width:
```
Blur_% = B / sensor_width × 100
```

---

## Part 7: Aspect Ratio Handling

### 7.1 The Problem

When formats have different aspect ratios, diagonal-based crop factor may not capture what you need. Options:

| Method | Use Case |
|--------|----------|
| Diagonal | Standard approach, matches image circle usage |
| Width | Matching horizontal FOV (common in video) |
| Height | Matching vertical FOV |
| Area | Total light/resolution comparison |

### 7.2 Alternative Crop Factors

**Width-based:**
```
CF_width = w_ref / w_sensor
```

**Height-based:**
```
CF_height = h_ref / h_sensor
```

**Area-based (for linear "crop factor"):**
```
CF_area = sqrt(A_ref / A_sensor)
```

### 7.3 Example: 35mm (3:2) vs MFT (4:3)

| Crop Factor Type | Calculation | Result |
|------------------|-------------|--------|
| Diagonal | 43.27 / 21.64 | 2.00× |
| Width | 36 / 17.3 | 2.08× |
| Height | 24 / 13 | 1.85× |
| Area | sqrt(864/225) | 1.96× |

---

## Part 8: Complete Conversion Procedure

### 8.1 General Conversion Between Formats

**Given:** Format A with focal length f_A and aperture N_A
**Find:** Equivalent on Format B

**Step 1: Calculate crop factor**
```
CF = d_B / d_A
```

**Step 2: Equivalent focal length**
```
f_B = f_A × CF
```

**Step 3: Equivalent aperture (same DOF)**
```
N_B = N_A × CF
```

**Step 4: Verify entrance pupil matches**
```
D_A = f_A / N_A
D_B = f_B / N_B  [should equal D_A]
```

**Step 5: Equivalent ISO (same noise)**
```
ISO_B = ISO_A × CF²
```

### 8.2 Worked Example: APS-C 35mm f/2.8 → 6×7

**Given:**
- APS-C: 23.6 × 15.6mm, d = 28.3mm
- 6×7: 56 × 67mm, d = 87.3mm
- Lens: 35mm f/2.8

**Calculations:**
```
CF = 87.3 / 28.3 = 3.08

f_6x7 = 35 × 3.08 = 108mm (use 110mm)
N_6x7 = 2.8 × 3.08 = f/8.6

Verification:
D_apsc = 35 / 2.8 = 12.5mm
D_6x7 = 110 / 8.8 = 12.5mm ✓
```

**Result:** 35mm f/2.8 on APS-C ≈ 110mm f/8.6 on 6×7

### 8.3 Calculating DOF from Any Setup

**Given:** Sensor dimensions, focal length, aperture, subject distance

**Step 1: Calculate CoC**
```
d = sqrt(w² + h²)
CoC = d / 1500
```

**Step 2: Calculate hyperfocal distance**
```
H = f² / (N × CoC)
```

**Step 3: Calculate near/far limits**
```
D_n = (H × s) / (H + s - f)
D_f = (H × s) / (H - s + f)
DOF = D_f - D_n
```

---

## Part 9: Format Reference Tables

### 9.1 Small Format

| Format | Dimensions (mm) | Diagonal | Crop Factor |
|--------|-----------------|----------|-------------|
| Full Frame 35mm | 36 × 24 | 43.27 | 1.00 |
| APS-H (Canon) | 28.7 × 19.0 | 34.5 | 1.26 |
| APS-C (Nikon/Sony) | 23.6 × 15.6 | 28.3 | 1.53 |
| APS-C (Canon) | 22.3 × 14.9 | 26.8 | 1.62 |
| Micro Four Thirds | 17.3 × 13.0 | 21.6 | 2.00 |
| 1" sensor | 13.2 × 8.8 | 15.9 | 2.72 |

### 9.2 Medium Format

| Format | Dimensions (mm) | Diagonal | Crop Factor |
|--------|-----------------|----------|-------------|
| Digital MF (Fuji/Hass.) | 43.8 × 32.9 | 54.8 | 0.79 |
| Phase One (full) | 53.7 × 40.4 | 67.1 | 0.65 |
| 645 film | 56 × 41.5 | 69.7 | 0.62 |
| 6×6 film | 56 × 56 | 79.2 | 0.55 |
| 6×7 film | 56 × 67 | 87.3 | 0.50 |
| 6×9 film | 56 × 84 | 100.9 | 0.43 |

### 9.3 Large Format

| Format | Dimensions (mm) | Diagonal | Crop Factor |
|--------|-----------------|----------|-------------|
| 4×5 | 102 × 127 | 163 | 0.27 |
| 5×7 | 127 × 178 | 219 | 0.20 |
| 8×10 | 203 × 254 | 325 | 0.13 |

### 9.4 Cinema Formats

| Format | Dimensions (mm) | Diagonal | Crop Factor |
|--------|-----------------|----------|-------------|
| Super 16 | 12.52 × 7.41 | 14.5 | 2.98 |
| Academy 35mm | 22 × 16 | 27.2 | 1.59 |
| Super 35 | 24.89 × 18.66 | 31.1 | 1.39 |
| VistaVision | 37.7 × 18.3 | 41.9 | 1.03 |

---

## Quick Reference Card

### Equivalence Formulas (Source → Target)
```
CF = d_target / d_source
f_equiv = f × CF
N_equiv = N × CF
ISO_equiv = ISO × CF²
```

### Depth of Field
```
H = f² / (N × CoC)
D_n = Hs / (H + s)  [approx]
D_f = Hs / (H - s)  [approx]
DOF = D_f - D_n
```

### CoC Standard
```
CoC = diagonal / 1500
```

### Background Blur
```
B = f² / (N × s)  [background at infinity]
```

---

## Sources

- DOFMaster: Depth of Field Equations - https://www.dofmaster.com/equations.html
- Wikipedia: Circle of Confusion - https://en.wikipedia.org/wiki/Circle_of_confusion
- Wikipedia: Crop Factor - https://en.wikipedia.org/wiki/Crop_factor
- Photons to Photos: Bokeh Ball Diameter - https://www.photonstophotos.net/
- Scantips: Crop Factor Calculators - https://www.scantips.com/lights/cropfactor3.html
- Photography Life: Equivalence - https://photographylife.com/equivalence-also-includes-aperture-and-iso
- DPReview: What is Equivalence - https://www.dpreview.com/articles/2666934640/
- Berkeley CS: DOF Equations - https://inst.eecs.berkeley.edu/~cs39j/
