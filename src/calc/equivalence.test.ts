import { describe, expect, it } from 'vitest';
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
import type { Format } from './types';

describe('equivalence calculations', () => {
  const fullFrame: Format = {
    id: 'full-frame',
    name: 'Full Frame',
    width: 36,
    height: 24,
  };

  const apsc: Format = {
    id: 'apsc',
    name: 'APS-C',
    width: 22.5,
    height: 15,
  };

  const fullFrameDerived = withDerived(fullFrame);
  const apscDerived = withDerived(apsc);

  describe('calculateCropFactorBetweenFormats', () => {
    it('calculates scaling factor from source to target format', () => {
      // Note: This returns target/source ratio, NOT the traditional "crop factor"
      // Traditional crop factor (FF/APS-C) = 1.6
      // This function returns APS-C/FF = 0.625 (for scaling focal lengths)
      const cf = calculateCropFactorBetweenFormats(
        fullFrameDerived,
        apscDerived,
        'diagonal'
      );
      expect(cf).toBeCloseTo(0.625, 2);
    });

    it('calculates width crop factor', () => {
      const cf = calculateCropFactorBetweenFormats(
        fullFrameDerived,
        apscDerived,
        'width'
      );
      expect(cf).toBeCloseTo(0.625, 2);
    });

    it('calculates area crop factor', () => {
      const cf = calculateCropFactorBetweenFormats(
        fullFrameDerived,
        apscDerived,
        'area'
      );
      expect(cf).toBeCloseTo(0.625, 2);
    });

    it('returns 1.0 for same format', () => {
      const cf = calculateCropFactorBetweenFormats(
        fullFrameDerived,
        fullFrameDerived,
        'diagonal'
      );
      expect(cf).toBe(1);
    });
  });

  describe('calculateEquivalentFocalLength', () => {
    it('calculates equivalent focal length on APS-C', () => {
      // 50mm on FF → 50 × 0.625 ≈ 31mm on APS-C for same FOV
      const equiv = calculateEquivalentFocalLength(50, 0.625);
      expect(equiv).toBeCloseTo(31.25, 1);
    });
  });

  describe('calculateEquivalentAperture', () => {
    it('calculates equivalent aperture on APS-C', () => {
      // f/1.4 on FF → f/0.875 on APS-C for same DOF/blur
      const equiv = calculateEquivalentAperture(1.4, 0.625);
      expect(equiv).toBeCloseTo(0.875, 2);
    });
  });

  describe('calculateEntrancePupil', () => {
    it('calculates entrance pupil diameter', () => {
      // 50mm f/1.4 → 35.7mm entrance pupil
      const pupil = calculateEntrancePupil(50, 1.4);
      expect(pupil).toBeCloseTo(35.71, 1);
    });
  });

  describe('calculateApertureForMatchingBlur', () => {
    it('calculates aperture to match blur when focal is overridden', () => {
      // Given: FF 50mm f/1.4, want to find aperture for APS-C 35mm
      // Formula: N_t = N_s × (f_t / f_s) × (w_s / w_t)
      //        = 1.4 × (35/50) × (36/22.5) = 1.4 × 0.7 × 1.6 ≈ 1.57
      const aperture = calculateApertureForMatchingBlur(
        50, // source focal
        1.4, // source aperture
        36, // source width
        35, // target focal
        22.5 // target width
      );
      expect(aperture).toBeCloseTo(1.568, 2);
    });

    it('returns wider aperture when using longer lens on smaller sensor', () => {
      // If target lens is proportionally longer, need wider aperture
      const aperture = calculateApertureForMatchingBlur(
        50, // source focal
        2.8, // source aperture
        36, // source width
        50, // target focal (same, but smaller sensor)
        22.5 // target width
      );
      // N_t = 2.8 × (50/50) × (36/22.5) = 2.8 × 1 × 1.6 = 4.48
      expect(aperture).toBeCloseTo(4.48, 2);
    });
  });

  describe('calculateApertureForMatchingDOF', () => {
    it('calculates aperture to match DOF when focal is overridden', () => {
      const aperture = calculateApertureForMatchingDOF(
        50,
        1.4,
        fullFrameDerived.diagonal,
        35,
        apscDerived.diagonal
      );
      expect(aperture).toBeGreaterThan(0);
    });
  });

  describe('calculateFocalForMatchingBlur', () => {
    it('calculates focal to match blur when aperture is overridden', () => {
      // Given: FF 50mm f/1.4, want to find focal for APS-C at f/1.4
      const focal = calculateFocalForMatchingBlur(
        50, // source focal
        1.4, // source aperture
        36, // source width
        1.4, // target aperture (same)
        22.5 // target width
      );
      // Should be shorter since sensor is smaller
      expect(focal).toBeLessThan(50);
    });
  });

  describe('calculateFocalForMatchingDOF', () => {
    it('calculates focal to match DOF when aperture is overridden', () => {
      const focal = calculateFocalForMatchingDOF(
        50,
        1.4,
        fullFrameDerived.diagonal,
        1.4,
        apscDerived.diagonal
      );
      expect(focal).toBeGreaterThan(0);
    });
  });

  describe('calculateTargetSubjectDistance', () => {
    it('scales subject distance to maintain framing', () => {
      // If target focal is shorter, need to be closer
      const targetDistance = calculateTargetSubjectDistance(2000, 50, 35);
      expect(targetDistance).toBe(1400);
    });

    it('returns same distance for same focal length', () => {
      const targetDistance = calculateTargetSubjectDistance(2000, 50, 50);
      expect(targetDistance).toBe(2000);
    });
  });
});
