import type {
  EquivalenceResult,
  Format,
  FormatWithDerived,
  Options,
  SideResult,
  SourceState,
  TargetState,
} from './types';
import { calculateAOV } from './aov';
import { calculateBlurDisc, calculateBlurPercent } from './blur';
import { calculateDOF } from './dof';
import {
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
import { withDerived } from './format';

export function calculateSideResult(
  format: FormatWithDerived,
  focalLength: number,
  aperture: number,
  subjectDistance?: number
): SideResult {
  const result: SideResult = {
    format,
    focalLength,
    aperture,
    entrancePupil: calculateEntrancePupil(focalLength, aperture),
    aov: calculateAOV(format, focalLength),
  };

  if (subjectDistance !== undefined) {
    result.subjectDistance = subjectDistance;
    result.dof = calculateDOF(focalLength, aperture, format.coc, subjectDistance);
    result.blurDisc = calculateBlurDisc(focalLength, aperture, subjectDistance);
    result.blurPercent = calculateBlurPercent(result.blurDisc, format.width);
  }

  return result;
}

export interface CalculateEquivalenceInput {
  source: SourceState;
  target: TargetState;
  options: Options;
  formats: Format[];
}

export function calculateEquivalence(
  input: CalculateEquivalenceInput
): EquivalenceResult {
  const { source, target, options } = input;

  // Look up formats and calculate derived values
  const sourceFormat = findFormat(input.formats, source.formatId);
  const targetFormat = findFormat(input.formats, target.formatId);

  const sourceWithDerived = withDerived(sourceFormat);
  const targetWithDerived = withDerived(targetFormat);

  // Calculate crop factor between formats
  const cropFactor = calculateCropFactorBetweenFormats(
    sourceWithDerived,
    targetWithDerived,
    options.equivalenceMethod
  );

  // Determine target focal length and aperture based on overrides
  const { targetFocalLength, targetAperture, isFocalOverridden, isApertureOverridden } =
    resolveTargetValues(
      source,
      target,
      sourceWithDerived,
      targetWithDerived,
      cropFactor,
      options
    );

  // Calculate source side result
  const sourceResult = calculateSideResult(
    sourceWithDerived,
    source.focalLength,
    source.aperture,
    source.subjectDistance ?? undefined
  );

  // Calculate target subject distance (scaled to maintain framing)
  const targetSubjectDistance =
    source.subjectDistance !== null
      ? calculateTargetSubjectDistance(
          source.subjectDistance,
          source.focalLength,
          targetFocalLength
        )
      : undefined;

  // Calculate target side result
  const targetResult = calculateSideResult(
    targetWithDerived,
    targetFocalLength,
    targetAperture,
    targetSubjectDistance
  );

  return {
    source: sourceResult,
    target: targetResult,
    cropFactor,
    isTargetFocalOverridden: isFocalOverridden,
    isTargetApertureOverridden: isApertureOverridden,
  };
}

function findFormat(formats: Format[], id: string): Format {
  const format = formats.find((f) => f.id === id);
  if (!format) {
    throw new Error(`Format not found: ${id}`);
  }
  return format;
}

interface ResolvedTargetValues {
  targetFocalLength: number;
  targetAperture: number;
  isFocalOverridden: boolean;
  isApertureOverridden: boolean;
}

function resolveTargetValues(
  source: SourceState,
  target: TargetState,
  sourceFormat: FormatWithDerived,
  targetFormat: FormatWithDerived,
  cropFactor: number,
  options: Options
): ResolvedTargetValues {
  const isFocalOverridden = target.focalLengthOverride !== null;
  const isApertureOverridden = target.apertureOverride !== null;

  // Situation 1: Default equivalence (no overrides)
  if (!isFocalOverridden && !isApertureOverridden) {
    return {
      targetFocalLength: calculateEquivalentFocalLength(source.focalLength, cropFactor),
      targetAperture: calculateEquivalentAperture(source.aperture, cropFactor),
      isFocalOverridden: false,
      isApertureOverridden: false,
    };
  }

  // Situations 3 & 4: Focal length overridden
  if (isFocalOverridden) {
    const targetFocalLength = target.focalLengthOverride!;
    let targetAperture: number;

    if (options.matchMode === 'blur_disc') {
      // Situation 3: Match blur disc
      targetAperture = calculateApertureForMatchingBlur(
        source.focalLength,
        source.aperture,
        sourceFormat.width,
        targetFocalLength,
        targetFormat.width
      );
    } else {
      // Situation 4: Match DOF
      targetAperture = calculateApertureForMatchingDOF(
        source.focalLength,
        source.aperture,
        sourceFormat.diagonal,
        targetFocalLength,
        targetFormat.diagonal
      );
    }

    return {
      targetFocalLength,
      targetAperture,
      isFocalOverridden: true,
      isApertureOverridden: false,
    };
  }

  // Situations 5 & 6: Aperture overridden
  const targetAperture = target.apertureOverride!;
  let targetFocalLength: number;

  if (options.matchMode === 'blur_disc') {
    // Situation 5: Match blur disc
    targetFocalLength = calculateFocalForMatchingBlur(
      source.focalLength,
      source.aperture,
      sourceFormat.width,
      targetAperture,
      targetFormat.width
    );
  } else {
    // Situation 6: Match DOF
    targetFocalLength = calculateFocalForMatchingDOF(
      source.focalLength,
      source.aperture,
      sourceFormat.diagonal,
      targetAperture,
      targetFormat.diagonal
    );
  }

  return {
    targetFocalLength,
    targetAperture,
    isFocalOverridden: false,
    isApertureOverridden: true,
  };
}
