/* eslint-disable sonarjs/no-duplicate-string */

import * as types from '../actionTypes.js';
import validationReducer from './validationReducer.js';

describe('validationReducer', () => {
  it('returns the initial state', () => {
    expect(validationReducer(undefined, {})).toEqual({
      inProgress: false,
      rawResults: null,
      results: null,
      ruleset: DEFAULT_RULESET,
    });
  });

  it('handles SET_VALIDATION_IN_PROGRESS', () => {
    expect(
      validationReducer([], {
        type: types.SET_VALIDATION_IN_PROGRESS,
      })
    ).toEqual({
      inProgress: true,
      rawResults: null,
      results: null,
    });
  });

  it('handles SET_VALIDATION_RESULTS', () => {
    expect(
      validationReducer(
        { rawResults: null, results: null, inProgress: false },
        {
          type: types.SET_VALIDATION_RESULTS,
          results: [
            {
              code: 'string-maxlength',
              message: 'Test message 1',
              path: ['components', 'parameters', 'test', 'schema'],
              severity: 1,
              range: {
                start: { line: 7, character: 13 },
                end: { line: 8, character: 20 },
              },
            },
          ],
        }
      )
    ).toEqual({
      inProgress: false,
      rawResults: [
        {
          code: 'string-maxlength',
          message: 'Test message 1',
          path: ['components', 'parameters', 'test', 'schema'],
          severity: 1,
          range: {
            start: { line: 7, character: 13 },
            end: { line: 8, character: 20 },
          },
        },
      ],
      results: [
        {
          code: 'string-maxlength',
          message: 'Test message 1',
          path: ['components', 'parameters', 'test', 'schema'],
          severity: 1,
          range: {
            start: { line: 7, character: 13 },
            end: { line: 8, character: 20 },
          },
        },
      ],
    });
  });
});
