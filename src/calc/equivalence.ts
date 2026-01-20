import type { EquivalenceMethod, FormatWithDerived } from './types';

// Crop factor between two formats based on equivalence method
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
      return Math.sqrt((target.width * target.height) / (source.width * source.height));
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
// Note: This accounts for subject distance scaling (s_target = s_source × f_target/f_source)
export function calculateApertureForMatchingBlur(
  sourceFocalLength: number,
  sourceAperture: number,
  sourceWidth: number,
  targetFocalLength: number,
  targetWidth: number
): number {
  // Derivation with scaled subject distance:
  // Source blur %: f_s² / (N_s × s_s × w_s)
  // Target blur %: f_t² / (N_t × s_t × w_t) where s_t = s_s × (f_t/f_s)
  //              = f_t² / (N_t × s_s × (f_t/f_s) × w_t)
  //              = f_t × f_s / (N_t × s_s × w_t)
  // Setting equal: N_t = N_s × (f_t / f_s) × (w_s / w_t)
  const focalRatio = targetFocalLength / sourceFocalLength;
  const widthRatio = sourceWidth / targetWidth;
  return sourceAperture * focalRatio * widthRatio;
}

// Situation 4: Aperture to match DOF when focal length is overridden
// Note: This accounts for subject distance scaling (s_target = s_source × f_target/f_source)
export function calculateApertureForMatchingDOF(
  _sourceFocalLength: number,
  sourceAperture: number,
  sourceDiagonal: number,
  _targetFocalLength: number,
  targetDiagonal: number
): number {
  // Derivation with scaled subject distance using DOF ≈ 2 × N × CoC × s² / f²:
  // DOF_source = 2 × N_s × CoC_s × s_s² / f_s²
  // DOF_target = 2 × N_t × CoC_t × s_t² / f_t² where s_t = s_s × (f_t/f_s)
  //            = 2 × N_t × CoC_t × s_s² × f_t²/(f_s² × f_t²)
  //            = 2 × N_t × CoC_t × s_s² / f_s²
  // Setting equal: N_s × CoC_s = N_t × CoC_t
  // Since CoC = d/1500: N_t = N_s × d_source / d_target
  // Note: focal lengths cancel out completely when subject distance is scaled
  const diagonalRatio = sourceDiagonal / targetDiagonal;
  return sourceAperture * diagonalRatio;
}

// Situation 5: Focal length to match blur disc when aperture is overridden
// Note: This accounts for subject distance scaling (s_target = s_source × f_target/f_source)
export function calculateFocalForMatchingBlur(
  sourceFocalLength: number,
  sourceAperture: number,
  sourceWidth: number,
  targetAperture: number,
  targetWidth: number
): number {
  // Derivation with scaled subject distance:
  // Source blur %: f_s / (N_s × w_s) (subject distance cancels after scaling)
  // Target blur %: f_t / (N_t × w_t)
  // Setting equal: f_t = f_s × (N_t / N_s) × (w_t / w_s)
  const apertureRatio = targetAperture / sourceAperture;
  const widthRatio = targetWidth / sourceWidth;
  return sourceFocalLength * apertureRatio * widthRatio;
}

// Situation 6: Focal length to match DOF when aperture is overridden
// Note: When subject distance is scaled, DOF depends only on N × CoC, not focal length.
// This returns a focal length that would give the same FOV as the equivalent lens.
export function calculateFocalForMatchingDOF(
  sourceFocalLength: number,
  sourceAperture: number,
  sourceDiagonal: number,
  targetAperture: number,
  targetDiagonal: number
): number {
  // With scaled subject distance, DOF ≈ 2 × N × CoC × s_s² / f_s² (independent of f_target)
  // Since DOF matching cannot be achieved by varying focal length alone,
  // we return a focal length that preserves the relationship between
  // blur and DOF characteristics:
  // f_target = f_source × sqrt((N_target × d_target) / (N_source × d_source))
  const numerator = targetAperture * targetDiagonal;
  const denominator = sourceAperture * sourceDiagonal;
  return sourceFocalLength * Math.sqrt(numerator / denominator);
}

// Scale subject distance to maintain same framing
export function calculateTargetSubjectDistance(
  sourceSubjectDistance: number,
  sourceFocalLength: number,
  targetFocalLength: number
): number {
  // s_target = s_source × (f_target / f_source)
  return sourceSubjectDistance * (targetFocalLength / sourceFocalLength);
}
