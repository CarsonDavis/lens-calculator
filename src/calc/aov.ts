import type { AngleOfView, FormatWithDerived } from './types';
import { radiansToDegrees } from './units';

export function calculateAOVForDimension(
  dimension: number,
  focalLength: number
): number {
  // AOV = 2 × arctan(dimension / (2 × f))
  const radians = 2 * Math.atan(dimension / (2 * focalLength));
  return radiansToDegrees(radians);
}

export function calculateAOV(
  format: FormatWithDerived,
  focalLength: number
): AngleOfView {
  return {
    horizontal: calculateAOVForDimension(format.width, focalLength),
    vertical: calculateAOVForDimension(format.height, focalLength),
    diagonal: calculateAOVForDimension(format.diagonal, focalLength),
  };
}
