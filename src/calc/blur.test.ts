import { describe, expect, it } from 'vitest';
import {
  calculateBlurDisc,
  calculateBlurDiscAtDistance,
  calculateBlurPercent,
} from './blur';

describe('blur disc calculations', () => {
  describe('calculateBlurDisc', () => {
    it('calculates blur disc for background at infinity', () => {
      // B = f² / (N × s) = 2500 / (1.4 × 2000) = 0.893mm
      const blur = calculateBlurDisc(50, 1.4, 2000);
      expect(blur).toBeCloseTo(0.893, 3);
    });

    it('returns larger blur for wider aperture', () => {
      const blur14 = calculateBlurDisc(50, 1.4, 2000);
      const blur28 = calculateBlurDisc(50, 2.8, 2000);
      expect(blur14).toBeGreaterThan(blur28);
    });

    it('returns larger blur for closer subject', () => {
      const blur2m = calculateBlurDisc(50, 1.4, 2000);
      const blur5m = calculateBlurDisc(50, 1.4, 5000);
      expect(blur2m).toBeGreaterThan(blur5m);
    });

    it('returns larger blur for longer focal length', () => {
      const blur50 = calculateBlurDisc(50, 1.4, 2000);
      const blur85 = calculateBlurDisc(85, 1.4, 2000);
      expect(blur85).toBeGreaterThan(blur50);
    });
  });

  describe('calculateBlurDiscAtDistance', () => {
    it('calculates blur for background at specific distance', () => {
      // Subject at 2m, background at 10m
      const blur = calculateBlurDiscAtDistance(50, 1.4, 2000, 10000);
      expect(blur).toBeGreaterThan(0);
    });

    it('returns 0 when background at subject distance', () => {
      const blur = calculateBlurDiscAtDistance(50, 1.4, 2000, 2000);
      expect(blur).toBeCloseTo(0, 10);
    });

    it('works for foreground (closer than subject)', () => {
      // Foreground at 1m, subject at 2m
      const blur = calculateBlurDiscAtDistance(50, 1.4, 2000, 1000);
      expect(blur).toBeGreaterThan(0);
    });
  });

  describe('calculateBlurPercent', () => {
    it('calculates blur as percentage of frame width', () => {
      // 0.893mm blur on 36mm frame = 2.48%
      const percent = calculateBlurPercent(0.893, 36);
      expect(percent).toBeCloseTo(2.48, 2);
    });

    it('returns higher percentage for smaller sensor', () => {
      const blur = 0.5;
      const percentFF = calculateBlurPercent(blur, 36);
      const percentAPS = calculateBlurPercent(blur, 22.5);
      expect(percentAPS).toBeGreaterThan(percentFF);
    });
  });
});
