/**
 * Number formatting utilities following design-system.md specifications.
 */

/**
 * Format focal length: 0-1 decimal places
 * Shows decimal only if not a whole number
 */
export function formatFocalLength(mm: number): string {
  if (Number.isInteger(mm)) {
    return `${mm}mm`;
  }
  return `${mm.toFixed(1)}mm`;
}

/**
 * Format aperture with f/ prefix
 * User input: 1 decimal, calculated: up to 2 decimals
 */
export function formatAperture(f: number, decimals: 1 | 2 = 1): string {
  return `f/${f.toFixed(decimals)}`;
}

/**
 * Format aperture value without prefix (for inputs)
 */
export function formatApertureValue(f: number, decimals: 1 | 2 = 1): string {
  return f.toFixed(decimals);
}

/**
 * Format distance with automatic unit selection:
 * - < 1m: millimeters, no decimals (850mm)
 * - 1m - 100m: meters, 1 decimal (2.5m)
 * - > 100m: meters, no decimals (150m)
 * - > 10km or past hyperfocal: infinity symbol
 */
export function formatDistance(mm: number | null): string {
  if (mm === null) {
    return '—';
  }

  // Greater than 10km shows as infinity
  if (mm >= 10_000_000) {
    return '∞';
  }

  // Less than 1 meter: show in mm
  if (mm < 1000) {
    return `${Math.round(mm)}mm`;
  }

  // 1m to 100m: show meters with 1 decimal
  const meters = mm / 1000;
  if (meters < 100) {
    return `${meters.toFixed(1)}m`;
  }

  // 100m+: show meters with no decimals
  return `${Math.round(meters)}m`;
}

/**
 * Format field of view in degrees with 1 decimal
 */
export function formatFOV(degrees: number): string {
  return `${degrees.toFixed(1)}°`;
}

/**
 * Format blur disc size with 2 decimals
 */
export function formatBlurDisc(mm: number): string {
  return `${mm.toFixed(2)}mm`;
}

/**
 * Format blur percentage with 2 decimals
 */
export function formatBlurPercent(percent: number): string {
  return `${percent.toFixed(2)}%`;
}

/**
 * Format circle of confusion with 3 decimals
 */
export function formatCoC(mm: number): string {
  return `${mm.toFixed(3)}mm`;
}

/**
 * Format crop factor with 2 decimals
 */
export function formatCropFactor(factor: number): string {
  return `${factor.toFixed(2)}×`;
}

/**
 * Format a value or return placeholder if undefined/null
 */
export function formatOrPlaceholder(
  value: number | null | undefined,
  formatter: (v: number) => string,
  placeholder = '—'
): string {
  if (value === null || value === undefined) {
    return placeholder;
  }
  return formatter(value);
}

// ============================================
// Input display formatters (without units)
// For use with NumberInput's formatDisplayValue prop
// ============================================

/**
 * Format focal length for input display: 0-1 decimals
 * Shows 1 decimal only if value is not a whole number
 */
export function formatFocalLengthInput(mm: number): string {
  const rounded = Math.round(mm * 10) / 10;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }
  return rounded.toFixed(1);
}

/**
 * Format aperture for input display (user input): 1 decimal
 */
export function formatApertureInputUser(f: number): string {
  return f.toFixed(1);
}

/**
 * Format aperture for input display (calculated): up to 2 decimals
 */
export function formatApertureInputCalculated(f: number): string {
  const rounded = Math.round(f * 100) / 100;
  // If it's a clean 1 decimal value, show 1 decimal
  if (Math.round(rounded * 10) / 10 === rounded) {
    return rounded.toFixed(1);
  }
  return rounded.toFixed(2);
}

/**
 * Format subject distance for input display: 0 decimals
 */
export function formatDistanceInput(mm: number): string {
  return String(Math.round(mm));
}
