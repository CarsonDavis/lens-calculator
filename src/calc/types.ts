// Core format types

export interface Format {
  id: string;
  name: string;
  width: number; // mm
  height: number; // mm
  isCustom?: boolean;
}

export interface FormatDerived {
  diagonal: number; // mm
  area: number; // mm²
  aspectRatio: number; // width / height
  coc: number; // circle of confusion (mm)
  cropFactor: number; // relative to 35mm
}

export interface FormatWithDerived extends Format, FormatDerived {}

// Unit types

export type Unit = 'mm' | 'inches';

export interface Length {
  value: number;
  unit: Unit;
}

// State types

export interface SourceState {
  formatId: string;
  focalLength: number; // mm
  aperture: number; // f-number
  subjectDistance: number | null; // mm, optional
}

export interface TargetState {
  formatId: string;
  focalLengthOverride: number | null; // mm, null = auto-calculate
  apertureOverride: number | null; // f-number, null = auto-calculate
  // Invariant: at most one override can be non-null
}

// Options types

export type EquivalenceMethod = 'diagonal' | 'width' | 'height' | 'area';
export type MatchMode = 'blur_disc' | 'dof';

export interface Options {
  equivalenceMethod: EquivalenceMethod;
  matchMode: MatchMode;
  displayUnit: Unit;
}

// Calculated result types

export interface AngleOfView {
  horizontal: number; // degrees
  vertical: number; // degrees
  diagonal: number; // degrees
}

export interface DOFResult {
  nearLimit: number; // mm
  farLimit: number | null; // mm, null = infinity
  total: number | null; // mm, null = infinite
  hyperfocal: number; // mm
}

export interface SideResult {
  format: FormatWithDerived;
  focalLength: number; // mm
  aperture: number; // f-number
  entrancePupil: number; // mm
  aov: AngleOfView;
  subjectDistance?: number; // mm, scaled for target
  dof?: DOFResult;
  blurDisc?: number; // mm
  blurPercent?: number; // % of frame width
}

export interface EquivalenceResult {
  source: SideResult;
  target: SideResult;
  cropFactor: number; // target/source based on method
  isTargetFocalOverridden: boolean;
  isTargetApertureOverridden: boolean;
}

// Format preset types (for JSON data)

export type FormatCategory = 'small' | 'medium' | 'large' | 'cinema';

export interface FormatPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: FormatCategory;
}

export interface FormatsFile {
  formats: FormatPreset[];
}

// Validation bounds

export const VALIDATION = {
  focalLength: { min: 1, max: 2000 }, // mm
  aperture: { min: 0.7, max: 128 }, // f-number
  subjectDistanceMax: 100_000_000, // 100km in mm
  formatDimension: { min: 1, max: 500 }, // mm
} as const;

// 35mm full frame diagonal for crop factor reference
export const FULL_FRAME_DIAGONAL = 43.27; // mm
