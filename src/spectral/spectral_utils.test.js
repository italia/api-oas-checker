/* eslint-disable sonarjs/no-duplicate-string */

import { duplicatedValidationResultsMock } from '../mocks/validationResultsMock.js';
import { getSeverityByLineMap, getUniqueValidationResults, getValidationResultKey } from './spectral_utils.js';

describe('Utils', () => {
  describe('getSeverityByLineMap', () => {
    it('returns severity 0 for line 8', () => {
      const validationResults = [
        {
          severity: 0,
          range: {
            start: { line: 7 },
          },
        },
        {
          severity: 1,
          range: {
            start: { line: 7 },
          },
        },
        {
          severity: 2,
          range: {
            start: { line: 7 },
          },
        },
      ];
      const lineSeverityMap = getSeverityByLineMap(validationResults);
      expect(lineSeverityMap.get(8)).toBe(0);
    });
    it('returns severity 0 for line 8', () => {
      const validationResults = [
        {
          severity: 1,
          range: {
            start: { line: 7 },
          },
        },
        {
          severity: 0,
          range: {
            start: { line: 7 },
          },
        },
        {
          severity: 2,
          range: {
            start: { line: 7 },
          },
        },
      ];
      const lineSeverityMap = getSeverityByLineMap(validationResults);
      expect(lineSeverityMap.get(8)).toBe(0);
    });

    it('returns severity 0 for line 8', () => {
      const validationResults = [
        {
          severity: 1,
          range: {
            start: { line: 7 },
          },
        },
        {
          severity: 2,
          range: {
            start: { line: 7 },
          },
        },
        {
          severity: 0,
          range: {
            start: { line: 7 },
          },
        },
      ];
      const lineSeverityMap = getSeverityByLineMap(validationResults);
      expect(lineSeverityMap.get(8)).toBe(0);
    });

    it('returns severity 1 for line 8', () => {
      const validationResults = [
        {
          severity: 1,
          range: {
            start: { line: 7 },
          },
        },
        {
          severity: 2,
          range: {
            start: { line: 7 },
          },
        },
      ];
      const lineSeverityMap = getSeverityByLineMap(validationResults);
      expect(lineSeverityMap.get(8)).toBe(1);
    });

    it('returns an empty map without errors', () => {
      const validationResults = null;
      const lineSeverityMap = getSeverityByLineMap(validationResults);
      expect(lineSeverityMap.size).toBe(0);
    });
  });

  describe('Deduplicate validation results', () => {
    it('returns the correct key', () => {
      expect(getValidationResultKey(duplicatedValidationResultsMock[0])).toBe('string-maxlength-0-7-Test message 1');
    });

    it('cleans validation results from duplicates', () => {
      const uniqueResults = getUniqueValidationResults(duplicatedValidationResultsMock);
      expect(uniqueResults.length).toBe(3);
      expect(uniqueResults.some((r) => r.code === 'string-maxlength' && r.severity === 0)).toBeTruthy();
      expect(uniqueResults.some((r) => r.code === 'string-maxlength' && r.severity === 1)).toBeTruthy();
      expect(uniqueResults.some((r) => r.code === 'another-code' && r.severity === 1)).toBeTruthy();
    });

    it('returns null without errors', () => {
      const uniqueResults = getUniqueValidationResults(null);
      expect(uniqueResults).toBeNull();
    });
  });
});
