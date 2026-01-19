# Calculations Reference

## Inputs

**Source (fully specified):**
- Format: width (mm), height (mm)
- Focal length (mm)
- Aperture (f-number)
- Subject distance (optional)

**Target:**
- Format: width (mm), height (mm)
- Focal length override (optional)
- Aperture override (optional)

**Options:**
- Equivalence method: diagonal | width | height | area
- Match mode (when overriding): blur_disc | dof

---

## Derived Values (Always Calculated)

### For Any Format

**Diagonal:**
```
d = sqrt(w² + h²)
```

**Circle of Confusion (CoC):**
```
CoC = d / 1500
```

**Crop Factor (relative to 35mm):**
```
CF = 43.27 / d
```

**Area:**
```
a = w * h
```

### For Any Format + Focal Length

**Angle of View:**
```
AOV_horizontal = 2 × arctan(w / (2 × f))
AOV_vertical   = 2 × arctan(h / (2 × f))
AOV_diagonal   = 2 × arctan(d / (2 × f))
```

### For Any Format + Focal Length + Aperture

**Entrance Pupil Diameter:**
```
D = f / N
```

---

## Situation 1: Default Equivalence

**When:** Target format selected, no overrides

**Crop Factor Between Formats:**
```
# Based on equivalence method option
diagonal: CF = d_target / d_source
width:    CF = w_target / w_source
height:   CF = h_target / h_source
area:     CF = sqrt((w_target × h_target) / (w_source × h_source))
```

**Equivalent Focal Length (same FOV):**
```
f_target = f_source × CF
```

**Equivalent Aperture (same entrance pupil):**
```
N_target = N_source × CF
```

**Why this works:**
```
D_source = f_source / N_source
D_target = f_target / N_target
# When CF is applied to both f and N, entrance pupils match
# Same entrance pupil + same FOV → both DOF and blur disc match
```

Note: DOF and blur disc only stay coupled when FOV matches. When focal length is overridden (Situations 3 & 4), they diverge.

---

## Situation 2: With Subject Distance

**When:** Subject distance provided

**Important:** Subject distance on target side is scaled to maintain same framing:
```
s_target = s_source × (f_target / f_source)
```
This reflects the real-world scenario: longer lens = step back to frame subject the same way.

**Hyperfocal Distance:**
```
H = f² / (N × CoC) + f
```

**Near Limit of Sharpness:**
```
D_near = (H × s) / (H + s - f)
```

**Far Limit of Sharpness:**
```
D_far = (H × s) / (H - s + f)
# If (H - s + f) ≤ 0, then D_far = ∞
```

**Total Depth of Field:**
```
DOF = D_far - D_near
```

**Blur Disc (background at infinity):**
```
B = f² / (N × s)
```

**Blur Disc (background at specific distance):**
```
B = (f / N) × (f / (s - f)) × |1 - s / s_background|
```

**Blur as Percentage of Frame:**
```
blur_percent = (B / w) × 100
```

---

## Situation 3: Focal Length Override — Match Blur Disc

**When:** User pins target focal length, match mode = blur_disc

**Goal:** Find N_target such that blur disc (as % of frame) matches source

For background at infinity:
```
B_source = f_source² / (N_source × s)
blur_percent_source = B_source / w_source

# Solve for N_target where blur_percent_target = blur_percent_source
B_target = blur_percent_source × w_target
N_target = f_target² / (B_target × s)
```

**Simplified (combining):**
```
N_target = N_source × (f_target² / f_source²) × (w_source / w_target)
```

---

## Situation 4: Focal Length Override — Match DOF

**When:** User pins target focal length, match mode = dof

**Goal:** Find N_target such that total DOF matches source

Using the approximation `DOF ≈ 2 × N × CoC × s² / f²`:
```
DOF_source = 2 × N_source × CoC_source × s² / f_source²

# Solve for N_target where DOF_target = DOF_source
N_target = N_source × (CoC_source / CoC_target) × (f_target² / f_source²)
```

**Expanded:**
```
N_target = N_source × (d_source / d_target) × (f_target² / f_source²)
```

Note: This uses the DOF approximation. For precise matching at close distances, would need to solve the full near/far limit equations iteratively.

---

## Situation 5: Aperture Override — Match Blur Disc

**When:** User pins target aperture, match mode = blur_disc

**Goal:** Find f_target such that blur disc (as % of frame) matches source

For background at infinity:
```
blur_percent_source = f_source² / (N_source × s × w_source)

# Solve for f_target where blur_percent_target = blur_percent_source
f_target = sqrt(N_target × s × w_target × blur_percent_source)
```

**Simplified (combining):**
```
f_target = f_source × sqrt((N_target / N_source) × (w_target / w_source))
```

---

## Situation 6: Aperture Override — Match DOF

**When:** User pins target aperture, match mode = dof

**Goal:** Find f_target such that total DOF matches source

Using the approximation `DOF ≈ 2 × N × CoC × s² / f²`:
```
# Solve for f_target where DOF_target = DOF_source
f_target = f_source × sqrt((N_target × CoC_target) / (N_source × CoC_source))
```

**Expanded with CoC = d/1500:**
```
f_target = f_source × sqrt((N_target × d_target) / (N_source × d_source))
```

---

## Note: Only One Override Allowed

UI enforces that only focal length OR aperture can be overridden at a time. Entering a value for one clears the other. This ensures there's always something to calculate.

---

## Unit Conversions

**Inches to mm:**
```
mm = inches × 25.4
```

**mm to inches:**
```
inches = mm / 25.4
```

**Degrees to radians:**
```
rad = deg × (π / 180)
```

**Radians to degrees:**
```
deg = rad × (180 / π)
```

---

## Summary Table

| Situation | Inputs | Calculates |
|-----------|--------|------------|
| Format only | w, h | diagonal, CoC, crop factor |
| + Focal length | + f | AOV (h, v, d) |
| + Aperture | + N | entrance pupil |
| + Subject distance | + s | hyperfocal, DOF near/far, blur disc |
| Default equivalence | source + target format | equiv focal, equiv aperture |
| Override focal (blur) | + pinned f_target | aperture for same blur % |
| Override focal (DOF) | + pinned f_target | aperture for same DOF |
