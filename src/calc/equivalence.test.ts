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
      // Given: FF 50mm f/1.4, want to find aperture for target 35mm
      // Formula: N_t = N_s × (f_t / f_s) = 1.4 × (35/50) = 0.98
      const aperture = calculateApertureForMatchingBlur(
        50, // source focal
        1.4, // source aperture
        35 // target focal
      );
      expect(aperture).toBeCloseTo(0.98, 2);
    });

    it('returns same aperture when using same focal length', () => {
      // When using same focal length, aperture stays the same
      const aperture = calculateApertureForMatchingBlur(
        50, // source focal
        2.8, // source aperture
        50 // target focal (same)
      );
      // N_t = 2.8 × (50/50) = 2.8
      expect(aperture).toBeCloseTo(2.8, 2);
    });

    it('matches default equivalence when using equivalent focal length', () => {
      // When f_t = f_s × CF (equivalent), result should match N_s × CF
      const cropFactor = apscDerived.diagonal / fullFrameDerived.diagonal; // ~0.625
      const equivalentFocal = 50 * cropFactor; // ~31.25mm
      const aperture = calculateApertureForMatchingBlur(
        50, // source focal
        1.4, // source aperture
        equivalentFocal // target focal = equivalent
      );
      // N_t = 1.4 × (31.25/50) = 1.4 × 0.625 = 0.875
      // This matches default equivalence: N_s × CF = 1.4 × 0.625 = 0.875
      expect(aperture).toBeCloseTo(0.875, 2);
    });
  });

  describe('calculateApertureForMatchingDOF', () => {
    it('calculates aperture to match DOF when focal is overridden', () => {
      // DOF matching always requires equivalent aperture: N_t = N_s × CF
      const cropFactor = apscDerived.diagonal / fullFrameDerived.diagonal; // ~0.625
      const aperture = calculateApertureForMatchingDOF(
        50,
        1.4,
        fullFrameDerived.diagonal,
        35,
        apscDerived.diagonal,
        cropFactor
      );
      // N_t = 1.4 × 0.625 = 0.875
      expect(aperture).toBeCloseTo(0.875, 2);
    });
  });

  describe('calculateFocalForMatchingBlur', () => {
    it('returns same focal when using same aperture', () => {
      // Formula: f_t = f_s × (N_t / N_s) = 50 × (1.4/1.4) = 50
      const focal = calculateFocalForMatchingBlur(
        50, // source focal
        1.4, // source aperture
        1.4 // target aperture (same)
      );
      expect(focal).toBeCloseTo(50, 1);
    });

    it('calculates shorter focal when using wider aperture', () => {
      // If target aperture is wider (smaller f-number), need shorter focal
      // f_t = f_s × (N_t / N_s) = 50 × (1.4/2.8) = 25
      const focal = calculateFocalForMatchingBlur(
        50, // source focal
        2.8, // source aperture
        1.4 // target aperture (wider)
      );
      expect(focal).toBeCloseTo(25, 1);
    });

    it('matches default equivalence when using equivalent aperture', () => {
      // When N_t = N_s × CF (equivalent), result should match f_s × CF
      const cropFactor = apscDerived.diagonal / fullFrameDerived.diagonal; // ~0.625
      const equivalentAperture = 1.4 * cropFactor; // ~0.875
      const focal = calculateFocalForMatchingBlur(
        50, // source focal
        1.4, // source aperture
        equivalentAperture // target aperture = equivalent
      );
      // f_t = 50 × (0.875/1.4) = 50 × 0.625 = 31.25
      // This matches default equivalence: f_s × CF = 50 × 0.625 = 31.25
      expect(focal).toBeCloseTo(31.25, 1);
    });
  });

  describe('calculateFocalForMatchingDOF', () => {
    it('returns equivalent focal length (DOF matching via focal is not possible)', () => {
      // DOF matching requires equivalent aperture, not focal length adjustment
      // Returns equivalent focal length to at least match FOV
      const cropFactor = apscDerived.diagonal / fullFrameDerived.diagonal; // ~0.625
      const focal = calculateFocalForMatchingDOF(
        50,
        1.4,
        fullFrameDerived.diagonal,
        1.4,
        apscDerived.diagonal,
        cropFactor
      );
      // Returns equivalent focal: 50 × 0.625 = 31.25
      expect(focal).toBeCloseTo(31.25, 1);
    });
  });

  describe('calculateTargetSubjectDistance', () => {
    it('scales subject distance to maintain framing (same format)', () => {
      // For same format (CF=1), if target focal is shorter, need to be closer
      const targetDistance = calculateTargetSubjectDistance(2000, 50, 35, 1);
      expect(targetDistance).toBe(1400);
    });

    it('returns same distance for equivalent focal length', () => {
      // For default equivalence (target = source × CF), distance stays the same
      const cropFactor = apscDerived.diagonal / fullFrameDerived.diagonal; // ~0.625
      const equivalentFocal = 50 * cropFactor; // ~31.25
      const targetDistance = calculateTargetSubjectDistance(
        2000,
        50,
        equivalentFocal,
        cropFactor
      );
      expect(targetDistance).toBeCloseTo(2000, 0);
    });

    it('scales distance when using non-equivalent focal length', () => {
      // FF 50mm → APS-C 35mm (not the equivalent 31.25mm)
      // Need to adjust distance to maintain framing
      const cropFactor = apscDerived.diagonal / fullFrameDerived.diagonal; // ~0.625
      const targetDistance = calculateTargetSubjectDistance(
        2000,
        50,
        35,
        cropFactor
      );
      // s_t = 2000 × (35 / (50 × 0.625)) = 2000 × (35 / 31.25) = 2240
      expect(targetDistance).toBeCloseTo(2240, 0);
    });
  });
});
