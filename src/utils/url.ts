import type { EquivalenceMethod, MatchMode, Format } from '@/calc';

/**
 * URL parameter keys (short for compact URLs)
 *
 * Source: sf (format id), sw/sh/sn (custom width/height/name), sl (focal), sa (aperture), sd (distance)
 * Target: tf (format id), tw/th/tn (custom width/height/name), tl (focal override), ta (aperture override)
 * Options: em (equivalence method), mm (match mode)
 */

export interface UrlState {
  // Source
  sourceFormatId?: string;
  sourceCustomWidth?: number;
  sourceCustomHeight?: number;
  sourceCustomName?: string;
  sourceFocalLength?: number;
  sourceAperture?: number;
  subjectDistance?: number | null;

  // Target
  targetFormatId?: string;
  targetCustomWidth?: number;
  targetCustomHeight?: number;
  targetCustomName?: string;
  targetFocalLengthOverride?: number | null;
  targetApertureOverride?: number | null;

  // Options
  equivalenceMethod?: EquivalenceMethod;
  matchMode?: MatchMode;
}

const EQUIVALENCE_METHODS: EquivalenceMethod[] = [
  'diagonal',
  'width',
  'height',
  'area',
];
const MATCH_MODES: MatchMode[] = ['blur_disc', 'dof'];

function parseNumber(value: string | null): number | undefined {
  if (value === null || value === '') return undefined;
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
}

function parseNullableNumber(value: string | null): number | null | undefined {
  if (value === null) return undefined;
  if (value === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Parse URL search params into state object
 */
export function parseUrlParams(search: string): UrlState {
  const params = new URLSearchParams(search);
  const state: UrlState = {};

  // Source format: preset ID or custom dimensions
  const sf = params.get('sf');
  const sw = parseNumber(params.get('sw'));
  const sh = parseNumber(params.get('sh'));

  if (sf) {
    state.sourceFormatId = sf;
  } else if (sw !== undefined && sh !== undefined) {
    state.sourceCustomWidth = sw;
    state.sourceCustomHeight = sh;
    state.sourceCustomName = params.get('sn') || undefined;
  }

  // Source lens settings
  const sl = parseNumber(params.get('sl'));
  const sa = parseNumber(params.get('sa'));
  const sd = parseNullableNumber(params.get('sd'));

  if (sl !== undefined) state.sourceFocalLength = sl;
  if (sa !== undefined) state.sourceAperture = sa;
  if (sd !== undefined) state.subjectDistance = sd;

  // Target format: preset ID or custom dimensions
  const tf = params.get('tf');
  const tw = parseNumber(params.get('tw'));
  const th = parseNumber(params.get('th'));

  if (tf) {
    state.targetFormatId = tf;
  } else if (tw !== undefined && th !== undefined) {
    state.targetCustomWidth = tw;
    state.targetCustomHeight = th;
    state.targetCustomName = params.get('tn') || undefined;
  }

  // Target overrides
  const tl = parseNullableNumber(params.get('tl'));
  const ta = parseNullableNumber(params.get('ta'));

  if (tl !== undefined) state.targetFocalLengthOverride = tl;
  if (ta !== undefined) state.targetApertureOverride = ta;

  // Options
  const em = params.get('em') as EquivalenceMethod | null;
  const mm = params.get('mm') as MatchMode | null;

  if (em && EQUIVALENCE_METHODS.includes(em)) {
    state.equivalenceMethod = em;
  }
  if (mm && MATCH_MODES.includes(mm)) {
    state.matchMode = mm;
  }

  return state;
}

export interface SerializeStateInput {
  sourceFormatId: string;
  sourceFocalLength: number;
  sourceAperture: number;
  subjectDistance: number | null;
  targetFormatId: string;
  targetFocalLengthOverride: number | null;
  targetApertureOverride: number | null;
  equivalenceMethod: EquivalenceMethod;
  matchMode: MatchMode;
  allFormats: Format[];
}

/**
 * Serialize state to URL search params
 */
export function serializeToUrlParams(input: SerializeStateInput): string {
  const params = new URLSearchParams();
  const {
    sourceFormatId,
    sourceFocalLength,
    sourceAperture,
    subjectDistance,
    targetFormatId,
    targetFocalLengthOverride,
    targetApertureOverride,
    equivalenceMethod,
    matchMode,
    allFormats,
  } = input;

  // Find formats to determine if they're custom
  const sourceFormat = allFormats.find((f) => f.id === sourceFormatId);
  const targetFormat = allFormats.find((f) => f.id === targetFormatId);

  // Source format
  if (sourceFormat?.isCustom) {
    params.set('sw', String(sourceFormat.width));
    params.set('sh', String(sourceFormat.height));
    if (sourceFormat.name) {
      params.set('sn', sourceFormat.name);
    }
  } else {
    params.set('sf', sourceFormatId);
  }

  // Source lens settings
  params.set('sl', String(sourceFocalLength));
  params.set('sa', String(sourceAperture));
  if (subjectDistance !== null) {
    params.set('sd', String(subjectDistance));
  }

  // Target format
  if (targetFormat?.isCustom) {
    params.set('tw', String(targetFormat.width));
    params.set('th', String(targetFormat.height));
    if (targetFormat.name) {
      params.set('tn', targetFormat.name);
    }
  } else {
    params.set('tf', targetFormatId);
  }

  // Target overrides
  if (targetFocalLengthOverride !== null) {
    params.set('tl', String(targetFocalLengthOverride));
  }
  if (targetApertureOverride !== null) {
    params.set('ta', String(targetApertureOverride));
  }

  // Options (only if non-default)
  if (equivalenceMethod !== 'diagonal') {
    params.set('em', equivalenceMethod);
  }
  if (matchMode !== 'blur_disc') {
    params.set('mm', matchMode);
  }

  return params.toString();
}

/**
 * Update URL without triggering navigation
 */
export function updateUrl(search: string): void {
  const url = new URL(window.location.href);
  url.search = search;
  window.history.replaceState(null, '', url.toString());
}

/**
 * Get current URL search params
 */
export function getCurrentUrlSearch(): string {
  return window.location.search;
}
