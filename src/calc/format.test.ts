import { describe, expect, it } from 'vitest';
import {
  calculateArea,
  calculateAspectRatio,
  calculateCoC,
  calculateCropFactor,
  calculateDiagonal,
  calculateFormatDerived,
  withDerived,
} from './format';
import type { Format } from './types';
import { FULL_FRAME_DIAGONAL } from './types';

describe('format utilities', () => {
  describe('calculateDiagonal', () => {
    it('calculates diagonal for full frame 35mm', () => {
      const diagonal = calculateDiagonal(36, 24);
      expect(diagonal).toBeCloseTo(43.27, 2);
    });

    it('calculates diagonal for APS-C', () => {
      const diagonal = calculateDiagonal(22.5, 15);
      expect(diagonal).toBeCloseTo(27.04, 2);
    });
  });

  describe('calculateCoC', () => {
    it('calculates CoC using diagonal / 1500', () => {
      const coc = calculateCoC(43.27);
      expect(coc).toBeCloseTo(0.0288, 4);
    });
  });

  describe('calculateCropFactor', () => {
    it('returns 1.0 for full frame', () => {
      const cropFactor = calculateCropFactor(FULL_FRAME_DIAGONAL);
      expect(cropFactor).toBeCloseTo(1.0, 2);
    });

    it('returns ~1.6 for APS-C generic', () => {
      const diagonal = calculateDiagonal(22.5, 15);
      const cropFactor = calculateCropFactor(diagonal);
      expect(cropFactor).toBeCloseTo(1.6, 1);
    });

    it('returns ~2 for Four Thirds', () => {
      const diagonal = calculateDiagonal(18, 13.5);
      const cropFactor = calculateCropFactor(diagonal);
      expect(cropFactor).toBeCloseTo(1.92, 1);
    });
  });

  describe('calculateArea', () => {
    it('calculates area correctly', () => {
      expect(calculateArea(36, 24)).toBe(864);
    });
  });

  describe('calculateAspectRatio', () => {
    it('returns 1.5 for 3:2 format', () => {
      expect(calculateAspectRatio(36, 24)).toBe(1.5);
    });

    it('returns ~1.33 for 4:3 format', () => {
      expect(calculateAspectRatio(18, 13.5)).toBeCloseTo(1.333, 2);
    });
  });

  describe('calculateFormatDerived', () => {
    it('returns all derived values for a format', () => {
      const format: Format = {
        id: 'full-frame',
        name: 'Full Frame',
        width: 36,
        height: 24,
      };
      const derived = calculateFormatDerived(format);

      expect(derived.diagonal).toBeCloseTo(43.27, 2);
      expect(derived.area).toBe(864);
      expect(derived.aspectRatio).toBe(1.5);
      expect(derived.coc).toBeCloseTo(0.0288, 4);
      expect(derived.cropFactor).toBeCloseTo(1.0, 2);
    });
  });

  describe('withDerived', () => {
    it('combines format with derived values', () => {
      const format: Format = {
        id: 'test',
        name: 'Test Format',
        width: 36,
        height: 24,
      };
      const result = withDerived(format);

      expect(result.id).toBe('test');
      expect(result.name).toBe('Test Format');
      expect(result.width).toBe(36);
      expect(result.height).toBe(24);
      expect(result.diagonal).toBeCloseTo(43.27, 2);
    });
  });
});
