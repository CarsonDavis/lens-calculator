import { describe, expect, it } from 'vitest';
import {
  degreesToRadians,
  inchesToMm,
  mmToInches,
  radiansToDegrees,
} from './units';

describe('unit conversions', () => {
  describe('mmToInches', () => {
    it('converts 25.4mm to 1 inch', () => {
      expect(mmToInches(25.4)).toBe(1);
    });

    it('converts 50.8mm to 2 inches', () => {
      expect(mmToInches(50.8)).toBeCloseTo(2, 5);
    });
  });

  describe('inchesToMm', () => {
    it('converts 1 inch to 25.4mm', () => {
      expect(inchesToMm(1)).toBe(25.4);
    });

    it('converts 2 inches to 50.8mm', () => {
      expect(inchesToMm(2)).toBe(50.8);
    });
  });

  describe('degreesToRadians', () => {
    it('converts 180 degrees to π radians', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10);
    });

    it('converts 90 degrees to π/2 radians', () => {
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 10);
    });

    it('converts 45 degrees to π/4 radians', () => {
      expect(degreesToRadians(45)).toBeCloseTo(Math.PI / 4, 10);
    });
  });

  describe('radiansToDegrees', () => {
    it('converts π radians to 180 degrees', () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180, 10);
    });

    it('converts π/2 radians to 90 degrees', () => {
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 10);
    });
  });

  describe('round-trip conversions', () => {
    it('mm -> inches -> mm returns original value', () => {
      const original = 50;
      const result = inchesToMm(mmToInches(original));
      expect(result).toBeCloseTo(original, 10);
    });

    it('degrees -> radians -> degrees returns original value', () => {
      const original = 63.5;
      const result = radiansToDegrees(degreesToRadians(original));
      expect(result).toBeCloseTo(original, 10);
    });
  });
});
