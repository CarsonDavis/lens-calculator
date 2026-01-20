import type { Format, FormatDerived, FormatWithDerived } from './types';
import { FULL_FRAME_DIAGONAL } from './types';

export function calculateDiagonal(width: number, height: number): number {
  return Math.sqrt(width * width + height * height);
}

export function calculateCoC(diagonal: number): number {
  return diagonal / 1500;
}

export function calculateCropFactor(diagonal: number): number {
  return FULL_FRAME_DIAGONAL / diagonal;
}

export function calculateArea(width: number, height: number): number {
  return width * height;
}

export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

export function calculateFormatDerived(format: Format): FormatDerived {
  const diagonal = calculateDiagonal(format.width, format.height);
  return {
    diagonal,
    area: calculateArea(format.width, format.height),
    aspectRatio: calculateAspectRatio(format.width, format.height),
    coc: calculateCoC(diagonal),
    cropFactor: calculateCropFactor(diagonal),
  };
}

export function withDerived(format: Format): FormatWithDerived {
  return {
    ...format,
    ...calculateFormatDerived(format),
  };
}
