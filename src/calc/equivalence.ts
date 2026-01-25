import type { EquivalenceMethod, FormatWithDerived } from './types';

// Scaling factor between two formats based on equivalence method
// Returns target/source ratio for scaling focal lengths and apertures
// Note: This is NOT the traditional "crop factor" (which is FF/smaller = 1.6 for APS-C)
// Example: FF→APS-C returns 0.625, meaning multiply FF focal length by 0.625 for equivalent on APS-C
export function calculateCropFactorBetweenFormats(
  source: FormatWithDerived,
  target: FormatWithDerived,
  method: EquivalenceMethod
): number {
  switch (method) {
    case 'diagonal':
      return target.diagonal / source.diagonal;
    case 'width':
      return target.width / source.width;
    case 'height':
      return target.height / source.height;
    case 'area':
      return Math.sqrt(
        (target.width * target.height) / (source.width * source.height)
      );
  }
}

// Equivalent focal length for same FOV
export function calculateEquivalentFocalLength(
  sourceFocalLength: number,
  cropFactor: number
): number {
  // f_target = f_source × CF
  return sourceFocalLength * cropFactor;
}

// Equivalent aperture for same entrance pupil (matches both DOF and blur)
export function calculateEquivalentAperture(
  sourceAperture: number,
  cropFactor: number
): number {
  // N_target = N_source × CF
  return sourceAperture * cropFactor;
}

// Entrance pupil diameter
export function calculateEntrancePupil(
  focalLength: number,
  aperture: number
): number {
  // D = f / N
  return focalLength / aperture;
}

// Situation 3: Aperture to match blur disc when focal length is overridden
// Subject distance scales to maintain framing: s_t = s_s × (f_t / f_s) × (w_s / w_t)
export function calculateApertureForMatchingBlur(
  sourceFocalLength: number,
  sourceAperture: number,
  targetFocalLength: number
): number {
  // Derivation with framing-based subject distance scaling:
  // For same framing: subject_size/frame_width is constant
  // This requires: s_t = s_s × (f_t / f_s) × (w_s / w_t)
  //
  // Source blur %: f_s² / (N_s × s_s × w_s)
  // Target blur %: f_t² / (N_t × s_t × w_t)
  //             = f_t² / (N_t × s_s × (f_t/f_s) × (w_s/w_t) × w_t)
  //             = f_t × f_s / (N_t × s_s × w_s)
  //
  // Setting equal: f_s² / (N_s × w_s) = f_t × f_s / (N_t × w_s)
  // Simplifies to: N_t = N_s × (f_t / f_s)
  //
  // This ensures when f_t = f_equiv, we get N_t = N_s × CF (matches default equivalence)
  return sourceAperture * (targetFocalLength / sourceFocalLength);
}

// Situation 4: Aperture to match DOF when focal length is overridden
// Note: Subject distance scales relative to equivalent focal length: s_target = s_source × f_target/f_equiv
export function calculateApertureForMatchingDOF(
  _sourceFocalLength: number,
  sourceAperture: number,
  _sourceDiagonal: number,
  _targetFocalLength: number,
  _targetDiagonal: number,
  cropFactor: number
): number {
  // Derivation with correct cross-format subject distance scaling:
  // DOF ≈ 2 × N × CoC × s² / f²
  // Subject distance: s_t = s_s × (f_t / f_equiv) = s_s × (f_t / (f_s × CF))
  // DOF_target = 2 × N_t × CoC_t × s_s² × (f_t/(f_s×CF))² / f_t²
  //            = 2 × N_t × CoC_t × s_s² / (f_s² × CF²)
  // Setting equal to DOF_source: N_t × CoC_t / CF² = N_s × CoC_s
  // Since CoC = d/1500 and CF = d_t/d_s:
  // N_t = N_s × (d_s/d_t) × CF² = N_s × (d_s/d_t) × (d_t/d_s)² = N_s × CF
  // Result: DOF matching always requires the equivalent aperture, regardless of focal length override
  return sourceAperture * cropFactor;
}

// Situation 5: Focal length to match blur disc when aperture is overridden
// Subject distance scales to maintain framing: s_t = s_s × (f_t / f_s) × (w_s / w_t)
export function calculateFocalForMatchingBlur(
  sourceFocalLength: number,
  sourceAperture: number,
  targetAperture: number
): number {
  // Derivation with framing-based subject distance scaling (see Situation 3):
  // From blur matching: N_t = N_s × (f_t / f_s)
  // Solving for f_t: f_t = f_s × (N_t / N_s)
  //
  // This ensures when N_t = N_s × CF (equivalent aperture), we get f_t = f_s × CF (equivalent focal)
  return sourceFocalLength * (targetAperture / sourceAperture);
}

// Situation 6: Focal length to match DOF when aperture is overridden
// Note: With correct subject distance scaling, DOF depends only on N × CoC × CF², not focal length.
// DOF matching requires N_t = N_s × CF (equivalent aperture). If aperture is overridden to a
// different value, exact DOF matching is impossible. We return the equivalent focal length
// to at least preserve FOV matching.
export function calculateFocalForMatchingDOF(
  sourceFocalLength: number,
  _sourceAperture: number,
  _sourceDiagonal: number,
  _targetAperture: number,
  _targetDiagonal: number,
  cropFactor: number
): number {
  // DOF matching cannot be achieved by varying focal length alone when aperture is overridden.
  // Return the equivalent focal length to maintain matching FOV.
  return sourceFocalLength * cropFactor;
}

// Scale subject distance to maintain same framing across formats
export function calculateTargetSubjectDistance(
  sourceSubjectDistance: number,
  sourceFocalLength: number,
  targetFocalLength: number,
  cropFactor: number
): number {
  // Subject distance scales relative to equivalent focal length:
  // s_target = s_source × (f_target / f_equiv)
  // where f_equiv = f_source × cropFactor
  //
  // For default equivalence (f_target = f_equiv): s_target = s_source (same distance)
  // For override cases: distance adjusts to maintain framing
  const equivalentFocalLength = sourceFocalLength * cropFactor;
  return sourceSubjectDistance * (targetFocalLength / equivalentFocalLength);
}
