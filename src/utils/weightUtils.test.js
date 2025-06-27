/**
 * Unit tests for weight conversion utilities
 * Run with: npm test weightUtils.test.js
 */

import {
  decimalToPercentage,
  percentageToDecimal,
  validatePercentageWeight,
  validateDecimalWeight,
  calculateWeightValidation,
  calculateEffectiveWeight,
  formatWeight,
  prepareWeightForAPI,
  prepareWeightFromAPI
} from './weightUtils';

describe('Weight Conversion Utilities', () => {
  
  describe('decimalToPercentage', () => {
    test('converts decimal to percentage correctly', () => {
      expect(decimalToPercentage(0.25)).toBe(25);
      expect(decimalToPercentage(0.5)).toBe(50);
      expect(decimalToPercentage(1.0)).toBe(100);
      expect(decimalToPercentage(0.0)).toBe(0);
    });

    test('handles edge cases', () => {
      expect(decimalToPercentage(null)).toBe(0);
      expect(decimalToPercentage(undefined)).toBe(0);
      expect(decimalToPercentage(NaN)).toBe(0);
    });

    test('rounds to 1 decimal place', () => {
      expect(decimalToPercentage(0.333)).toBe(33.3);
      expect(decimalToPercentage(0.6666)).toBe(66.7);
    });
  });

  describe('percentageToDecimal', () => {
    test('converts percentage to decimal correctly', () => {
      expect(percentageToDecimal(25)).toBe(0.25);
      expect(percentageToDecimal(50)).toBe(0.5);
      expect(percentageToDecimal(100)).toBe(1.0);
      expect(percentageToDecimal(0)).toBe(0);
    });

    test('handles string inputs', () => {
      expect(percentageToDecimal('25')).toBe(0.25);
      expect(percentageToDecimal('50.5')).toBe(0.505);
    });

    test('handles edge cases', () => {
      expect(percentageToDecimal(null)).toBe(0);
      expect(percentageToDecimal(undefined)).toBe(0);
      expect(percentageToDecimal('')).toBe(0);
      expect(percentageToDecimal('invalid')).toBe(0);
    });

    test('rounds to 3 decimal places', () => {
      expect(percentageToDecimal(33.333)).toBe(0.333);
      expect(percentageToDecimal(66.6666)).toBe(0.667);
    });
  });

  describe('validatePercentageWeight', () => {
    test('validates valid percentages', () => {
      const result = validatePercentageWeight(25);
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
      expect(result.value).toBe(25);
    });

    test('rejects invalid values', () => {
      expect(validatePercentageWeight(null).isValid).toBe(false);
      expect(validatePercentageWeight('').isValid).toBe(false);
      expect(validatePercentageWeight('invalid').isValid).toBe(false);
      expect(validatePercentageWeight(-1).isValid).toBe(false);
      expect(validatePercentageWeight(101).isValid).toBe(false);
    });
  });

  describe('calculateWeightValidation', () => {
    const existingWeights = [
      { weight: 30 },
      { weight: 20 }
    ];

    test('calculates validation correctly', () => {
      const result = calculateWeightValidation(existingWeights, 25);
      expect(result.total).toBe(75);
      expect(result.remaining).toBe(25);
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('restant: 25%');
    });

    test('detects when total exceeds limit', () => {
      const result = calculateWeightValidation(existingWeights, 60);
      expect(result.total).toBe(110);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('dépasser 100%');
    });

    test('recognizes perfect total', () => {
      const result = calculateWeightValidation(existingWeights, 50);
      expect(result.total).toBe(100);
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Parfait! Total: 100%');
    });
  });

  describe('calculateEffectiveWeight', () => {
    test('calculates effective weight correctly', () => {
      expect(calculateEffectiveWeight(50, 30)).toBe(15); // 50% * 30% = 15%
      expect(calculateEffectiveWeight(25, 40)).toBe(10); // 25% * 40% = 10%
    });

    test('handles edge cases', () => {
      expect(calculateEffectiveWeight(0, 50)).toBe(0);
      expect(calculateEffectiveWeight(50, 0)).toBe(0);
      expect(calculateEffectiveWeight(null, 50)).toBe(0);
    });
  });

  describe('API data preparation', () => {
    test('prepareWeightForAPI converts percentage to decimal', () => {
      const formData = { name: 'Test', weight: '25' };
      const result = prepareWeightForAPI(formData);
      expect(result.weight).toBe(0.25);
      expect(result.name).toBe('Test');
    });

    test('prepareWeightFromAPI converts decimal to percentage', () => {
      const apiData = { name: 'Test', weight: 0.25 };
      const result = prepareWeightFromAPI(apiData);
      expect(result.weight).toBe(25);
      expect(result.name).toBe('Test');
    });
  });

  describe('formatWeight', () => {
    test('formats percentages correctly', () => {
      expect(formatWeight(25.5, true, true)).toBe('25.5%');
      expect(formatWeight(25.5, true, false)).toBe('25.5');
    });

    test('formats decimals correctly', () => {
      expect(formatWeight(0.255, false)).toBe('0.255');
    });

    test('handles null/undefined values', () => {
      expect(formatWeight(null, true)).toBe('0%');
      expect(formatWeight(undefined, false)).toBe('0.000');
    });
  });

  // Integration test: round-trip conversion
  describe('Round-trip conversion integrity', () => {
    test('percentage -> decimal -> percentage maintains precision', () => {
      const originalPercentage = 33.3;
      const decimal = percentageToDecimal(originalPercentage);
      const backToPercentage = decimalToPercentage(decimal);
      expect(backToPercentage).toBe(originalPercentage);
    });

    test('decimal -> percentage -> decimal maintains precision', () => {
      const originalDecimal = 0.333;
      const percentage = decimalToPercentage(originalDecimal);
      const backToDecimal = percentageToDecimal(percentage);
      expect(Math.abs(backToDecimal - originalDecimal)).toBeLessThan(0.001);
    });
  });
}); 