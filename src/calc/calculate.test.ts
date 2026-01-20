import { describe, expect, it } from 'vitest';
import { calculateEquivalence, calculateSideResult } from './calculate';
import { withDerived } from './format';
import type { Format, Options, SourceState, TargetState } from './types';

describe('calculateSideResult', () => {
  const fullFrame: Format = {
    id: 'full-frame',
    name: 'Full Frame',
    width: 36,
    height: 24,
  };

  it('calculates basic side result without subject distance', () => {
    const format = withDerived(fullFrame);
    const result = calculateSideResult(format, 50, 1.4);

    expect(result.format.id).toBe('full-frame');
    expect(result.focalLength).toBe(50);
    expect(result.aperture).toBe(1.4);
    expect(result.entrancePupil).toBeCloseTo(35.71, 1);
    expect(result.aov.horizontal).toBeCloseTo(39.6, 1);
    expect(result.dof).toBeUndefined();
    expect(result.blurDisc).toBeUndefined();
  });

  it('calculates full side result with subject distance', () => {
    const format = withDerived(fullFrame);
    const result = calculateSideResult(format, 50, 1.4, 2000);

    expect(result.subjectDistance).toBe(2000);
    expect(result.dof).toBeDefined();
    expect(result.dof?.nearLimit).toBeLessThan(2000);
    expect(result.dof?.farLimit).toBeGreaterThan(2000);
    expect(result.blurDisc).toBeGreaterThan(0);
    expect(result.blurPercent).toBeGreaterThan(0);
  });
});

describe('calculateEquivalence', () => {
  const formats: Format[] = [
    { id: 'full-frame', name: 'Full Frame', width: 36, height: 24 },
    { id: 'apsc', name: 'APS-C', width: 22.5, height: 15 },
    { id: 'mft', name: 'Micro Four Thirds', width: 18, height: 13.5 },
  ];

  const defaultOptions: Options = {
    equivalenceMethod: 'diagonal',
    matchMode: 'blur_disc',
    displayUnit: 'mm',
  };

  describe('Situation 1: Default equivalence (no overrides)', () => {
    it('calculates equivalent focal and aperture for FF to APS-C', () => {
      const source: SourceState = {
        formatId: 'full-frame',
        focalLength: 50,
        aperture: 1.4,
        subjectDistance: null,
      };
      const target: TargetState = {
        formatId: 'apsc',
        focalLengthOverride: null,
        apertureOverride: null,
      };

      const result = calculateEquivalence({
        source,
        target,
        options: defaultOptions,
        formats,
      });

      // APS-C has ~0.625 crop factor relative to FF
      expect(result.cropFactor).toBeCloseTo(0.625, 2);
      expect(result.target.focalLength).toBeCloseTo(31.25, 1);
      expect(result.target.aperture).toBeCloseTo(0.875, 2);
      expect(result.isTargetFocalOverridden).toBe(false);
      expect(result.isTargetApertureOverridden).toBe(false);
    });

    it('maintains same AOV when using equivalent focal length', () => {
      const source: SourceState = {
        formatId: 'full-frame',
        focalLength: 50,
        aperture: 2,
        subjectDistance: null,
      };
      const target: TargetState = {
        formatId: 'apsc',
        focalLengthOverride: null,
        apertureOverride: null,
      };

      const result = calculateEquivalence({
        source,
        target,
        options: defaultOptions,
        formats,
      });

      // AOV should be very close (small difference due to rounding)
      expect(result.source.aov.diagonal).toBeCloseTo(
        result.target.aov.diagonal,
        0
      );
    });
  });

  describe('Situation 2: With subject distance', () => {
    it('scales target subject distance to maintain framing', () => {
      const source: SourceState = {
        formatId: 'full-frame',
        focalLength: 50,
        aperture: 1.4,
        subjectDistance: 2000,
      };
      const target: TargetState = {
        formatId: 'apsc',
        focalLengthOverride: null,
        apertureOverride: null,
      };

      const result = calculateEquivalence({
        source,
        target,
        options: defaultOptions,
        formats,
      });

      // Target distance should be scaled by focal length ratio
      const focalRatio = result.target.focalLength / result.source.focalLength;
      expect(result.target.subjectDistance).toBeCloseTo(2000 * focalRatio, 0);
    });

    it('calculates DOF for both sides', () => {
      const source: SourceState = {
        formatId: 'full-frame',
        focalLength: 50,
        aperture: 1.4,
        subjectDistance: 2000,
      };
      const target: TargetState = {
        formatId: 'apsc',
        focalLengthOverride: null,
        apertureOverride: null,
      };

      const result = calculateEquivalence({
        source,
        target,
        options: defaultOptions,
        formats,
      });

      expect(result.source.dof).toBeDefined();
      expect(result.target.dof).toBeDefined();
    });
  });

  describe('Situation 3: Focal length override with blur matching', () => {
    it('calculates aperture to match blur when focal is overridden', () => {
      const source: SourceState = {
        formatId: 'full-frame',
        focalLength: 50,
        aperture: 1.4,
        subjectDistance: 2000,
      };
      const target: TargetState = {
        formatId: 'apsc',
        focalLengthOverride: 35, // User specifies 35mm
        apertureOverride: null,
      };

      const result = calculateEquivalence({
        source,
        target,
        options: { ...defaultOptions, matchMode: 'blur_disc' },
        formats,
      });

      expect(result.target.focalLength).toBe(35);
      expect(result.isTargetFocalOverridden).toBe(true);
      expect(result.isTargetApertureOverridden).toBe(false);
      // Blur percent should be close
      expect(result.source.blurPercent).toBeCloseTo(
        result.target.blurPercent!,
        1
      );
    });
  });

  describe('Situation 4: Focal length override with DOF matching', () => {
    it('calculates aperture to match DOF when focal is overridden', () => {
      const source: SourceState = {
        formatId: 'full-frame',
        focalLength: 50,
        aperture: 2.8,
        subjectDistance: 2000,
      };
      const target: TargetState = {
        formatId: 'apsc',
        focalLengthOverride: 35,
        apertureOverride: null,
      };

      const result = calculateEquivalence({
        source,
        target,
        options: { ...defaultOptions, matchMode: 'dof' },
        formats,
      });

      expect(result.target.focalLength).toBe(35);
      expect(result.isTargetFocalOverridden).toBe(true);
    });
  });

  describe('Situation 5: Aperture override with blur matching', () => {
    it('calculates focal to match blur when aperture is overridden', () => {
      const source: SourceState = {
        formatId: 'full-frame',
        focalLength: 50,
        aperture: 1.4,
        subjectDistance: 2000,
      };
      const target: TargetState = {
        formatId: 'apsc',
        focalLengthOverride: null,
        apertureOverride: 1.4, // User wants same f-number
      };

      const result = calculateEquivalence({
        source,
        target,
        options: { ...defaultOptions, matchMode: 'blur_disc' },
        formats,
      });

      expect(result.target.aperture).toBe(1.4);
      expect(result.isTargetFocalOverridden).toBe(false);
      expect(result.isTargetApertureOverridden).toBe(true);
    });
  });

  describe('Situation 6: Aperture override with DOF matching', () => {
    it('calculates focal to match DOF when aperture is overridden', () => {
      const source: SourceState = {
        formatId: 'full-frame',
        focalLength: 50,
        aperture: 2.8,
        subjectDistance: 2000,
      };
      const target: TargetState = {
        formatId: 'apsc',
        focalLengthOverride: null,
        apertureOverride: 2.8,
      };

      const result = calculateEquivalence({
        source,
        target,
        options: { ...defaultOptions, matchMode: 'dof' },
        formats,
      });

      expect(result.target.aperture).toBe(2.8);
      expect(result.isTargetApertureOverridden).toBe(true);
    });
  });

  describe('error handling', () => {
    it('throws when format not found', () => {
      const source: SourceState = {
        formatId: 'nonexistent',
        focalLength: 50,
        aperture: 1.4,
        subjectDistance: null,
      };
      const target: TargetState = {
        formatId: 'apsc',
        focalLengthOverride: null,
        apertureOverride: null,
      };

      expect(() =>
        calculateEquivalence({
          source,
          target,
          options: defaultOptions,
          formats,
        })
      ).toThrow('Format not found: nonexistent');
    });
  });
});
