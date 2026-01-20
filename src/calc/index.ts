// Types
export type {
  AngleOfView,
  DOFResult,
  EquivalenceMethod,
  EquivalenceResult,
  Format,
  FormatCategory,
  FormatDerived,
  FormatPreset,
  FormatsFile,
  FormatWithDerived,
  Length,
  MatchMode,
  Options,
  SideResult,
  SourceState,
  TargetState,
  Unit,
} from './types';

export { FULL_FRAME_DIAGONAL, VALIDATION } from './types';

// Main calculation function
export { calculateEquivalence, calculateSideResult } from './calculate';
export type { CalculateEquivalenceInput } from './calculate';

// Angle of view
export { calculateAOV, calculateAOVForDimension } from './aov';

// Blur disc
export {
  calculateBlurDisc,
  calculateBlurDiscAtDistance,
  calculateBlurPercent,
} from './blur';

// Depth of field
export {
  calculateDOF,
  calculateFarLimit,
  calculateHyperfocal,
  calculateNearLimit,
  calculateTotalDOF,
} from './dof';

// Equivalence
export {
  calculateApertureForMatchingBlur,
  calculateApertureForMatchingDOF,
  calculateCropFactorBetweenFormats,
  calculateEntrancePupil,
  calculateEquivalentAperture,
  calculateEquivalentFocalLength,
  calculateFocalForMatchingBlur,
  calculateFocalForMatchingDOF,
  calculateTargetSubjectDistance,
} from './equivalence';

// Format utilities
export {
  calculateArea,
  calculateAspectRatio,
  calculateCoC,
  calculateCropFactor,
  calculateDiagonal,
  calculateFormatDerived,
  withDerived,
} from './format';

// Unit conversions
export {
  degreesToRadians,
  inchesToMm,
  mmToInches,
  radiansToDegrees,
} from './units';
