import { describe, expect, it } from 'vitest';
import { calculateAOV, calculateAOVForDimension } from './aov';
import { withDerived } from './format';
import type { Format } from './types';

describe('angle of view calculations', () => {
  const fullFrame: Format = {
    id: 'full-frame',
    name: 'Full Frame',
    width: 36,
    height: 24,
  };

  describe('calculateAOVForDimension', () => {
    it('calculates AOV for 50mm on 36mm width', () => {
      // 2 × arctan(36 / (2 × 50)) = 2 × arctan(0.36) ≈ 39.6°
      const aov = calculateAOVForDimension(36, 50);
      expect(aov).toBeCloseTo(39.6, 1);
    });

    it('calculates AOV for 24mm on 36mm width', () => {
      // Wide angle should give larger AOV
      const aov = calculateAOVForDimension(36, 24);
      expect(aov).toBeCloseTo(73.7, 1);
    });
  });

  describe('calculateAOV', () => {
    it('calculates all three AOV values for full frame 50mm', () => {
      const format = withDerived(fullFrame);
      const aov = calculateAOV(format, 50);

      // Horizontal: 2 × arctan(36 / 100) ≈ 39.6°
      expect(aov.horizontal).toBeCloseTo(39.6, 1);

      // Vertical: 2 × arctan(24 / 100) ≈ 27.0°
      expect(aov.vertical).toBeCloseTo(27.0, 1);

      // Diagonal: 2 × arctan(43.27 / 100) ≈ 46.8°
      expect(aov.diagonal).toBeCloseTo(46.8, 1);
    });

    it('returns wider AOV for wider angle lens', () => {
      const format = withDerived(fullFrame);
      const aov24 = calculateAOV(format, 24);
      const aov50 = calculateAOV(format, 50);

      expect(aov24.horizontal).toBeGreaterThan(aov50.horizontal);
      expect(aov24.vertical).toBeGreaterThan(aov50.vertical);
      expect(aov24.diagonal).toBeGreaterThan(aov50.diagonal);
    });
  });
});
