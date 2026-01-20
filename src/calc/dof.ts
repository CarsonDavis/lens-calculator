import type { DOFResult } from './types';

export function calculateHyperfocal(
  focalLength: number,
  aperture: number,
  coc: number
): number {
  // H = f² / (N × CoC) + f
  return (focalLength * focalLength) / (aperture * coc) + focalLength;
}

export function calculateNearLimit(
  hyperfocal: number,
  subjectDistance: number,
  focalLength: number
): number {
  // D_near = (H × s) / (H + s - f)
  return (
    (hyperfocal * subjectDistance) /
    (hyperfocal + subjectDistance - focalLength)
  );
}

export function calculateFarLimit(
  hyperfocal: number,
  subjectDistance: number,
  focalLength: number
): number | null {
  // D_far = (H × s) / (H - s + f)
  // If (H - s + f) ≤ 0, then D_far = ∞
  const denominator = hyperfocal - subjectDistance + focalLength;
  if (denominator <= 0) {
    return null; // infinity
  }
  return (hyperfocal * subjectDistance) / denominator;
}

export function calculateTotalDOF(
  nearLimit: number,
  farLimit: number | null
): number | null {
  if (farLimit === null) {
    return null; // infinite DOF
  }
  return farLimit - nearLimit;
}

export function calculateDOF(
  focalLength: number,
  aperture: number,
  coc: number,
  subjectDistance: number
): DOFResult {
  const hyperfocal = calculateHyperfocal(focalLength, aperture, coc);
  const nearLimit = calculateNearLimit(
    hyperfocal,
    subjectDistance,
    focalLength
  );
  const farLimit = calculateFarLimit(hyperfocal, subjectDistance, focalLength);
  const total = calculateTotalDOF(nearLimit, farLimit);

  return {
    nearLimit,
    farLimit,
    total,
    hyperfocal,
  };
}
