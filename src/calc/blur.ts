// Blur disc for background at infinity
// Uses exact formula: c = f² / (N × (s - f))
// Not the approximation f² / (N × s) which introduces error at close distances
export function calculateBlurDisc(
  focalLength: number,
  aperture: number,
  subjectDistance: number
): number {
  return (focalLength * focalLength) / (aperture * (subjectDistance - focalLength));
}

// Blur disc for background at a specific distance
export function calculateBlurDiscAtDistance(
  focalLength: number,
  aperture: number,
  subjectDistance: number,
  backgroundDistance: number
): number {
  // B = (f / N) × (f / (s - f)) × |1 - s / s_background|
  const entrancePupil = focalLength / aperture;
  const magnificationFactor = focalLength / (subjectDistance - focalLength);
  const distanceRatio = Math.abs(1 - subjectDistance / backgroundDistance);
  return entrancePupil * magnificationFactor * distanceRatio;
}

export function calculateBlurPercent(
  blurDisc: number,
  frameWidth: number
): number {
  // blur_percent = (B / w) × 100
  return (blurDisc / frameWidth) * 100;
}
