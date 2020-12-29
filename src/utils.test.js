import { getSeverityByLineMap } from './utils.js';

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
  });
});
