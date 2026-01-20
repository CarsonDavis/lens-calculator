import { describe, expect, it } from 'vitest';
import {
  calculateDOF,
  calculateFarLimit,
  calculateHyperfocal,
  calculateNearLimit,
  calculateTotalDOF,
} from './dof';

describe('depth of field calculations', () => {
  // Using full frame CoC of ~0.029mm
  const coc = 0.029;

  describe('calculateHyperfocal', () => {
    it('calculates hyperfocal distance for 50mm f/1.4', () => {
      // H = f² / (N × CoC) + f = 2500 / (1.4 × 0.029) + 50 ≈ 61625mm
      const h = calculateHyperfocal(50, 1.4, coc);
      expect(h).toBeCloseTo(61625, -2);
    });

    it('returns smaller hyperfocal for smaller aperture (larger f-number)', () => {
      const h14 = calculateHyperfocal(50, 1.4, coc);
      const h8 = calculateHyperfocal(50, 8, coc);
      expect(h8).toBeLessThan(h14);
    });

    it('returns smaller hyperfocal for shorter focal length', () => {
      const h50 = calculateHyperfocal(50, 2.8, coc);
      const h24 = calculateHyperfocal(24, 2.8, coc);
      expect(h24).toBeLessThan(h50);
    });
  });

  describe('calculateNearLimit', () => {
    it('calculates near limit of sharpness', () => {
      const hyperfocal = 10000; // 10m
      const subjectDistance = 2000; // 2m
      const focalLength = 50;

      // D_near = (H × s) / (H + s - f) = (10000 × 2000) / (10000 + 2000 - 50) = 20000000 / 11950 ≈ 1674
      const near = calculateNearLimit(hyperfocal, subjectDistance, focalLength);
      expect(near).toBeCloseTo(1674, 0);
    });
  });

  describe('calculateFarLimit', () => {
    it('calculates far limit when finite', () => {
      const hyperfocal = 10000;
      const subjectDistance = 2000;
      const focalLength = 50;

      // D_far = (H × s) / (H - s + f) = (10000 × 2000) / (10000 - 2000 + 50)
      const far = calculateFarLimit(hyperfocal, subjectDistance, focalLength);
      expect(far).toBeCloseTo(2484, 0);
    });

    it('returns null (infinity) when subject beyond hyperfocal + focal length', () => {
      const hyperfocal = 10000;
      const focalLength = 50;
      // Infinity when (H - s + f) ≤ 0, i.e., s ≥ H + f = 10050
      const subjectDistance = 10051;

      const far = calculateFarLimit(hyperfocal, subjectDistance, focalLength);
      expect(far).toBeNull();
    });

    it('returns large finite value when subject at hyperfocal', () => {
      const hyperfocal = 10000;
      const subjectDistance = 10000; // at hyperfocal
      const focalLength = 50;

      // D_far = (H × s) / (H - s + f) = (10000 × 10000) / 50 = 2,000,000mm = 2km
      const far = calculateFarLimit(hyperfocal, subjectDistance, focalLength);
      expect(far).toBeCloseTo(2_000_000, -3);
    });
  });

  describe('calculateTotalDOF', () => {
    it('calculates total DOF when far limit is finite', () => {
      const total = calculateTotalDOF(1672, 2484);
      expect(total).toBeCloseTo(812, 0);
    });

    it('returns null when far limit is infinity', () => {
      const total = calculateTotalDOF(5000, null);
      expect(total).toBeNull();
    });
  });

  describe('calculateDOF', () => {
    it('returns complete DOF result', () => {
      const result = calculateDOF(50, 2.8, coc, 2000);

      expect(result.hyperfocal).toBeGreaterThan(0);
      expect(result.nearLimit).toBeGreaterThan(0);
      expect(result.nearLimit).toBeLessThan(2000);
      expect(result.farLimit).toBeGreaterThan(2000);
      expect(result.total).toBeGreaterThan(0);
    });

    it('returns infinite far limit when focused beyond hyperfocal', () => {
      const hyperfocal = calculateHyperfocal(50, 8, coc);
      // Focus beyond hyperfocal + focal_length to get infinite far limit
      const result = calculateDOF(50, 8, coc, hyperfocal + 51);

      expect(result.farLimit).toBeNull();
      expect(result.total).toBeNull();
    });

    it('returns very large far limit when focused at hyperfocal', () => {
      const hyperfocal = calculateHyperfocal(50, 8, coc);
      const result = calculateDOF(50, 8, coc, hyperfocal);

      // At hyperfocal, far limit = H²/f which is very large but finite
      expect(result.farLimit).toBeGreaterThan(1_000_000);
      expect(result.total).toBeGreaterThan(1_000_000);
    });
  });
});
