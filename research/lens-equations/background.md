# Camera Format Equivalence - Background Research

## Overview
Comprehensive research on equations for converting between camera formats: focal length equivalence, aperture/depth of field equivalence, bokeh calculations, and handling mismatched aspect ratios.

---

## Focal Length Equivalence and Crop Factor

### Core Formula
**Crop Factor = Diagonal of reference format / Diagonal of sensor**

The standard reference is 35mm full-frame (36mm x 24mm) with diagonal = 43.27mm.

For any sensor: `diagonal = sqrt(width² + height²)`

**Equivalent Focal Length = Actual Focal Length × Crop Factor**

This provides the same **field of view** (angle of view) as the reference format.

### Why Diagonal is Used
The view from a lens is a circular area (image circle), and the largest rectangular frame that can fit has a diagonal equal to the diameter of the circle. Different aspect ratio frames can fit, but comparing diagonals accounts for these differences. Two frames with the same aspect ratio could compare widths or heights without error, but different aspect ratios must compare diagonals. ([Source: Scantips][1])

### Examples
- Canon APS-C (22.3×14.9mm): diagonal = 26.8mm, crop = 43.27/26.8 = **1.6x**
- Nikon APS-C (23.6×15.6mm): diagonal = 28.3mm, crop = 43.27/28.3 = **1.53x**
- Micro Four Thirds (17.3×13mm): diagonal = 21.6mm, crop = 43.27/21.6 = **2.0x**
- 645 medium format (56×41.5mm): diagonal = 69.7mm, crop = 43.27/69.7 = **0.62x**
- 6x7 medium format (56×67mm): diagonal = 87.3mm, crop = 43.27/87.3 = **0.50x**

([Source: Photography Bay][2], [Adorama][3], [Wikipedia][4])

---

## Depth of Field Equations

### Hyperfocal Distance
**H = f² / (N × c)**

Where:
- H = hyperfocal distance (mm)
- f = focal length (mm)
- N = f-number (aperture)
- c = circle of confusion diameter (mm)

When focused at hyperfocal distance, everything from H/2 to infinity is acceptably sharp.

### Near Limit of Acceptable Sharpness
**Dn = (H × s) / (H + s - f)**

Or equivalently: **Dn = (s × f²) / (f² + N × c × (s - f))**

### Far Limit of Acceptable Sharpness
**Df = (H × s) / (H - s + f)**

Or equivalently: **Df = (s × f²) / (f² - N × c × (s - f))**

If the denominator ≤ 0, Df = infinity.

Where:
- Dn = near distance of acceptable sharpness
- Df = far distance of acceptable sharpness
- s = focus distance (subject distance)
- f = focal length
- H = hyperfocal distance
- N = f-number
- c = circle of confusion

### Total Depth of Field
**DOF = Df - Dn**

### DOF in Terms of Magnification
For macro and close-up work, magnification-based formulas are more useful:

**DOF = 2 × N × c × (m + 1) / (m² - (N × c / f)²)**

Where m = magnification (image size / object size)

For most practical cases where (Nc/f)² << m², this simplifies to:
**DOF ≈ 2 × N × c × (m + 1) / m²**

At high magnification (m >> 1):
**DOF ≈ 2 × N × c / m²**

### Key Relationships
- DOF varies **linearly** with f-number (N) and circle of confusion (c)
- DOF varies **inversely with the square** of focal length (f²)
- DOF varies **with the square** of subject distance (s²)
- DOF varies **inversely with the square** of magnification (m²)

### Adjusting f-number for Different CoC
Since f-number (N) and CoC (c) always appear as the product Nc in DOF formulas, changing one is equivalent to changing the other:

If a lens DOF scale assumes CoC₁ but you need CoC₂:
**N_adjusted = N_scale × (CoC₁ / CoC₂)**

([Source: DOFMaster][5], [Berkeley CS][6], [Wikipedia][7], [Wikipedia - Circle of Confusion][20])

---

## Circle of Confusion

### Definition
The circle of confusion (CoC) is the blur spot created when a point source is not perfectly focused. In photography, it defines the threshold for "acceptable sharpness" - points blurred smaller than the CoC appear sharp.

### The "Zeiss Formula" for CoC Limit
**CoC = d / 1730**

Where d = diagonal of the sensor/film in mm.

The 1730 constant derives from 0.025mm CoC on full-frame 35mm (43.25/0.025 = 1730).

### Alternative Standards
- **d / 1730** = "Zeiss formula" (yields 0.025mm for FF)
- **d / 1500** = Modern standard (yields 0.029mm for FF) - most widely used
- **d / 1000** = Traditional Zeiss standard (yields 0.043mm for FF)

### Complete CoC Derivation Formula
**CoC (mm) = (viewing_distance_cm / 25) / (resolution_lp_mm × enlargement × 2)**

Where:
- viewing_distance_cm = expected viewing distance in cm
- resolution_lp_mm = desired resolution in line pairs/mm at 25cm (typically 5 lp/mm)
- enlargement = ratio of final image size to sensor size
- Factor of 2 converts line pairs to single lines

Example: 50cm viewing, 5 lp/mm, 8× enlargement:
CoC = (50/25) / (5 × 8 × 2) = 0.025mm

### Calculating Actual Blur Circle Size
For an out-of-focus object at distance S₂ when focused at S₁:

**Blur circle in object plane:**
C = A × |S₂ - S₁| / S₂

**Blur circle in image plane (actual CoC):**
c = A × |S₂ - S₁| / S₂ × f / (S₁ - f)

Or in terms of f-number N = f/A:
**c = |S₂ - S₁| / S₂ × f² / (N × (S₁ - f))**

Where:
- A = aperture diameter (entrance pupil)
- S₁ = focused distance (subject distance)
- S₂ = out-of-focus object distance
- f = focal length
- N = f-number

### Special Cases

**Object at infinity when focused at S₁:**
c = f × A / (S₁ - f) = f² / (N × (S₁ - f))

**Focus at infinity, object at S₂:**
c = f × A / S₂ = f² / (N × S₂)

Setting c to the CoC limit and solving for distance gives the hyperfocal distance.

### Physical Meaning
The CoC limit depends on:
1. Final print/display size (enlargement factor)
2. Viewing distance
3. Visual acuity of viewer (typically ~5 lp/mm at 25cm)

For digital, a practical approach: CoC ≈ pixel pitch × 2 (at minimum, CoC should equal pixel pitch)

### Common CoC Values (d/1500 standard)

| Format | Frame Size | CoC (d/1500) |
|--------|------------|--------------|
| 1" sensor | 8.8 × 13.2 mm | 0.011 mm |
| Four Thirds | 13.5 × 18 mm | 0.015 mm |
| APS-C (Canon) | 14.8 × 22.2 mm | 0.018 mm |
| APS-C (Nikon/Sony) | 15.7 × 23.6 mm | 0.019 mm |
| APS-H (Canon) | 19.0 × 28.7 mm | 0.023 mm |
| Full Frame 35mm | 24 × 36 mm | 0.029 mm |
| 645 | 42 × 56 mm | 0.047 mm |
| 6×6 | 56 × 56 mm | 0.053 mm |
| 6×7 | 56 × 69 mm | 0.059 mm |
| 6×9 | 56 × 84 mm | 0.067 mm |
| 6×12 | 56 × 112 mm | 0.083 mm |
| 6×17 | 56 × 168 mm | 0.12 mm |
| 4×5 | 102 × 127 mm | 0.11 mm |
| 5×7 | 127 × 178 mm | 0.15 mm |
| 8×10 | 203 × 254 mm | 0.22 mm |

([Source: Wikipedia - Circle of Confusion][20], [Watchprosite][8], [Tangentsoft][9])

---

## Aperture Equivalence

### Key Insight
**Depth of field is determined by the physical aperture diameter, not the f-number.**

The f-number is a ratio: **N = f / D** where D is the entrance pupil diameter.

Two lenses with the **same entrance pupil diameter** at the **same subject distance** with the **same framing** will produce the **same depth of field**.

### Equivalent Aperture Formula
**Equivalent f-number = Actual f-number × Crop Factor**

This gives the f-number on the reference format that produces equivalent DOF.

### Example: APS-C 35mm f/2.8 to Full Frame
- APS-C crop factor = 1.5
- Equivalent focal length = 35 × 1.5 = 52.5mm
- Equivalent aperture = f/2.8 × 1.5 = f/4.2

So a 35mm f/2.8 on APS-C gives similar FOV and DOF to a ~50mm f/4 on full frame.

### Example: APS-C 35mm f/2.8 to 6x7 Medium Format
- APS-C to 6x7 crop factor = 28.3 / 87.3 = 0.324
- 6x7 to APS-C crop factor = 87.3 / 28.3 = 3.08
- Equivalent focal length on 6x7 = 35 × 3.08 = 108mm
- Equivalent aperture on 6x7 = f/2.8 × 3.08 = f/8.6

So a 35mm f/2.8 on APS-C gives similar FOV and DOF to a ~110mm f/8.6 on 6x7.

### Important: Exposure vs DOF
- **Exposure** (light per unit area) is determined by f-number alone
- **Total light** (light on entire sensor) scales with sensor area
- **Depth of field** is determined by physical aperture diameter

At equivalent settings (same FOV, same DOF, same shutter speed):
- Smaller sensor uses lower f-number → same physical aperture
- Larger sensor uses higher f-number → same physical aperture
- **Exposure is different** but **total light gathered is similar**
- To match total light, multiply ISO by crop factor squared

([Source: Mirrorlessons][10], [DPReview][11], [Photography Life][12])

---

## Bokeh Mathematics (Background Blur)

### Blur Disc Diameter - General Formula
**B = PD × |m - mb| / (1 + mb/p)**

Where:
- B = blur disc diameter (in subject space)
- PD = entrance pupil diameter = f/N
- m = in-focus magnification
- mb = magnification if blur-producing object were in focus
- p = pupil magnification (exit pupil / entrance pupil)

### Simplified Formula (when mb << p, typical case)
**B = PD × |m - mb|**

### Infinity Assumption (background very far away, mb ≈ 0)
**B = PD × m = (f/N) × m**

Since m ≈ f/s for distant subjects: **B ≈ f²/(N × s)**

### Distance-Based Formula
**B = PD × m × |1 - S/Sb|**

Where:
- S = subject distance
- Sb = background distance

### Key Relationships for Background Blur
1. **Blur ∝ 1/N** (linear with aperture opening)
2. **Blur ∝ f** (linear with focal length, when background is far)
3. **Blur ∝ 1/S** (closer subject = more blur)
4. **Blur ∝ (Sb - S)/Sb** (greater subject-to-background separation = more blur)

### Background Blur vs Depth of Field
**These are NOT the same thing!**

- DOF depends on CoC (a threshold of "acceptable" sharpness)
- Background blur is the actual size of blur discs
- A lens can have large DOF but still blur a distant background significantly

([Source: Photons to Photos][13], [Lewis Collard][14], [Bob Atkins][15])

---

## Aspect Ratio Handling

### The Problem
When converting between formats with different aspect ratios (e.g., 3:2 vs 4:3 vs 6:7), the diagonal-based crop factor doesn't tell the whole story. You may want to match:
1. **Diagonal** (standard approach) - matches image circle utilization
2. **Width** (horizontal FOV) - common for video/cinema
3. **Height** (vertical FOV) - useful for portraits
4. **Area** (total light/resolution) - useful for noise/detail comparison

### Diagonal-Based (Standard)
**Crop Factor = d_ref / d_sensor**

This is the most common approach and what most resources use.

### Width-Based Crop Factor
**Crop_width = width_ref / width_sensor**

Example: 35mm (36mm wide) vs MFT (17.3mm wide) = 36/17.3 = 2.08x

### Height-Based Crop Factor
**Crop_height = height_ref / height_sensor**

Example: 35mm (24mm tall) vs MFT (13mm tall) = 24/13 = 1.85x

### Area-Based Crop Factor
**Crop_area = sqrt(area_ref / area_sensor)**

The square root converts area ratio to a linear "crop factor."

Example: 35mm (864mm²) vs MFT (225mm²) = sqrt(864/225) = sqrt(3.84) = 1.96x

### Practical Approach for Mismatched Ratios
1. **For equivalent framing** (same subject size in frame):
   - Use diagonal crop factor for FOV equivalence
   - One format will have extra coverage on one axis

2. **For matching horizontal FOV** (common in video):
   - Use width-based crop factor
   - Vertical FOV will differ

3. **For total light gathering comparison**:
   - Use area-based crop factor
   - Multiply ISO by (crop_area)² to match noise

### Aspect Ratio Constants
To calculate dimensions from diagonal for a given aspect ratio (w:h):

**width = diagonal × (w / sqrt(w² + h²))**
**height = diagonal × (h / sqrt(w² + h²))**

| Aspect Ratio | Width Factor | Height Factor |
|--------------|--------------|---------------|
| 3:2 | 0.832 | 0.555 |
| 4:3 | 0.800 | 0.600 |
| 16:9 | 0.872 | 0.490 |
| 1:1 | 0.707 | 0.707 |
| 5:4 | 0.781 | 0.625 |
| 7:6 (6x7 film) | 0.759 | 0.651 |

([Source: Scantips][1], [RED][16])

---

## Common Sensor/Film Dimensions

### Small Format (35mm and below)

| Format | Dimensions (mm) | Diagonal (mm) | Aspect Ratio | Crop Factor |
|--------|-----------------|---------------|--------------|-------------|
| Full Frame 35mm | 36 × 24 | 43.27 | 3:2 | 1.00 |
| APS-H (Canon) | 28.7 × 19.0 | 34.5 | 3:2 | 1.26 |
| APS-C (Nikon/Sony) | 23.6 × 15.6 | 28.3 | 3:2 | 1.53 |
| APS-C (Canon) | 22.3 × 14.9 | 26.8 | 3:2 | 1.62 |
| Micro Four Thirds | 17.3 × 13.0 | 21.6 | 4:3 | 2.00 |
| 1" sensor | 13.2 × 8.8 | 15.9 | 3:2 | 2.72 |
| 1/2.3" sensor | 6.17 × 4.55 | 7.66 | 4:3 | 5.65 |

### Medium Format (120/220 film and digital)

| Format | Dimensions (mm) | Diagonal (mm) | Aspect Ratio | Crop Factor |
|--------|-----------------|---------------|--------------|-------------|
| Fuji GFX / Hasselblad X | 43.8 × 32.9 | 54.8 | 4:3 | 0.79 |
| Pentax 645D | 44.0 × 33.0 | 55.0 | 4:3 | 0.79 |
| Phase One (full) | 53.7 × 40.4 | 67.1 | 4:3 | 0.65 |
| 645 film | 56 × 41.5 | 69.7 | 4:3 | 0.62 |
| 6×6 film | 56 × 56 | 79.2 | 1:1 | 0.55 |
| 6×7 film | 56 × 67 | 87.3 | 6:7 | 0.50 |
| 6×9 film | 56 × 84 | 100.9 | 2:3 | 0.43 |
| 6×17 panoramic | 56 × 168 | 177.1 | 1:3 | 0.24 |

### Large Format (sheet film)

| Format | Dimensions (mm) | Diagonal (mm) | Crop Factor |
|--------|-----------------|---------------|-------------|
| 4×5 | 102 × 127 | 163 | 0.27 |
| 5×7 | 127 × 178 | 219 | 0.20 |
| 8×10 | 203 × 254 | 325 | 0.13 |

### Cinema/Video Formats

| Format | Dimensions (mm) | Diagonal (mm) | Crop Factor |
|--------|-----------------|---------------|-------------|
| Super 16 | 12.52 × 7.41 | 14.5 | 2.98 |
| Academy 35mm | 22 × 16 | 27.2 | 1.59 |
| Super 35 (3-perf) | 24.89 × 18.66 | 31.1 | 1.39 |
| VistaVision | 37.7 × 18.3 | 41.9 | 1.03 |

([Source: Design215][17], [Ken Rockwell][18], [G Dan Mitchell][19])

---

## Complete Conversion Example

### Problem: Convert APS-C 35mm f/2.8 to 6x7 equivalent

**Given:**
- APS-C sensor: 23.6 × 15.6mm, diagonal = 28.3mm
- 6x7 film: 56 × 67mm, diagonal = 87.3mm
- Lens: 35mm f/2.8

**Step 1: Calculate relative crop factor**
Crop factor from APS-C to 6x7 = 87.3 / 28.3 = 3.08

**Step 2: Calculate equivalent focal length**
Equivalent FL = 35mm × 3.08 = **107.8mm ≈ 110mm**

**Step 3: Calculate equivalent aperture (for same DOF)**
Equivalent f-number = f/2.8 × 3.08 = **f/8.6**

**Step 4: Verify with entrance pupil diameter**
- APS-C: Entrance pupil = 35/2.8 = 12.5mm
- 6x7: Entrance pupil = 110/8.8 = 12.5mm ✓

**Result:** 35mm f/2.8 on APS-C ≈ 110mm f/8.6 on 6x7 (same FOV and DOF)

**Note on exposure:** The 6x7 at f/8.6 receives ~9.4× less light per unit area, but the sensor is ~9.5× larger in area, so total light gathered is nearly identical.

---

## Sources

[1]: https://www.scantips.com/lights/cropfactor3.html "Scantips: Crop Factor Calculators"
[2]: https://photographybay.com/2016/02/06/understanding-medium-format-crop-factors/ "Photography Bay: Understanding Medium Format Crop Factors"
[3]: https://www.adorama.com/alc/what-is-crop-factor-everything-you-need-to-know/ "Adorama: What Is Crop Factor"
[4]: https://en.wikipedia.org/wiki/Crop_factor "Wikipedia: Crop Factor"
[5]: https://www.dofmaster.com/equations.html "DOFMaster: Depth of Field Equations"
[6]: https://inst.eecs.berkeley.edu/~cs39j/sp05/handouts/depth.of.field.writeup.html "Berkeley CS: DOF and Hyperfocal Equations"
[7]: https://en.wikipedia.org/wiki/Depth_of_field "Wikipedia: Depth of Field"
[8]: https://www.watchprosite.com/photography/using-the-zeiss-formula-to-understand-the-circle-of-confusion/1278.1127636.8608906/ "Watchprosite: Zeiss Formula"
[9]: https://tangentsoft.com/fcalc/manual/coc.html "Tangentsoft: Circle of Confusion"
[10]: https://www.mirrorlessons.com/2016/02/08/aperture-equivalent-sensor-size/ "Mirrorlessons: Aperture and Sensor Size"
[11]: https://www.dpreview.com/articles/2666934640/what-is-equivalence-and-why-should-i-care "DPReview: What is Equivalence"
[12]: https://photographylife.com/equivalence-also-includes-aperture-and-iso "Photography Life: Equivalence Includes Aperture and ISO"
[13]: https://www.photonstophotos.net/GeneralTopics/Lenses/Optics_Primer/Optics_Primer_18_50.htm "Photons to Photos: Bokeh Ball Diameter"
[14]: https://shutter.lewiscollard.com/background-blur/ "Lewis Collard: Background Blur"
[15]: https://bobatkins.com/photography/technical/bokeh_background_blur.html "Bob Atkins: Bokeh Calculator"
[16]: https://www.red.com/red-101/sensor-crop-factors "RED: Sensor Crop Factors"
[17]: https://design215.com/toolbox/film_chart.php "Design215: Film Size Chart"
[18]: https://www.kenrockwell.com/tech/format.htm "Ken Rockwell: Film Formats Compared"
[19]: https://gdanmitchell.com/2019/05/24/data-for-comparing-formats/ "G Dan Mitchell: Format Size Comparison Data"
[20]: https://en.wikipedia.org/wiki/Circle_of_confusion "Wikipedia: Circle of Confusion"
