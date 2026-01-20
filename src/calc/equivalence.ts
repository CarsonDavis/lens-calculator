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
// Note: Subject distance scales relative to equivalent focal length: s_target = s_source × f_target/f_equiv
export function calculateApertureForMatchingBlur(
  sourceFocalLength: number,
  sourceAperture: number,
  sourceWidth: number,
  targetFocalLength: number,
  targetWidth: number,
  cropFactor: number
): number {
  // Derivation with correct cross-format subject distance scaling:
  // Source blur %: f_s² / (N_s × s_s × w_s)
  // Target blur %: f_t² / (N_t × s_t × w_t)
  // Subject distance: s_t = s_s × (f_t / f_equiv) = s_s × (f_t / (f_s × CF))
  // Substituting: f_t² / (N_t × s_s × (f_t/(f_s×CF)) × w_t) = f_t × f_s × CF / (N_t × s_s × w_t)
  // Setting equal: N_t = N_s × (f_t / f_s) × CF × (w_s / w_t)
  const focalRatio = targetFocalLength / sourceFocalLength;
  const widthRatio = sourceWidth / targetWidth;
  return sourceAperture * focalRatio * cropFactor * widthRatio;
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
// Note: Subject distance scales relative to equivalent focal length: s_target = s_source × f_target/f_equiv
export function calculateFocalForMatchingBlur(
  sourceFocalLength: number,
  sourceAperture: number,
  sourceWidth: number,
  targetAperture: number,
  targetWidth: number,
  cropFactor: number
): number {
  // Derivation with correct cross-format subject distance scaling:
  // From blur matching: f_s / (N_s × w_s) = f_t × CF / (N_t × w_t)
  // Solving for f_t: f_t = f_s × (N_t / N_s) × (w_t / w_s) / CF
  const apertureRatio = targetAperture / sourceAperture;
  const widthRatio = targetWidth / sourceWidth;
  return (sourceFocalLength * apertureRatio * widthRatio) / cropFactor;
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
