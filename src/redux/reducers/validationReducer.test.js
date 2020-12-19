import validationReducer from './validationReducer.js';
import * as types from '../actionTypes.js';

describe('validation reducer', () => {
  it('should return the initial state', () => {
    expect(validationReducer(undefined, {})).toEqual({
      results: null,
      inProgress: false,
    });
  });

  it('should handle SET_VALIDATION_IN_PROGRESS', () => {
    expect(
      validationReducer([], {
        type: types.SET_VALIDATION_IN_PROGRESS,
      })
    ).toEqual({
      results: null,
      inProgress: true,
    });
  });

  it('should handle SET_VALIDATION_RESULTS', () => {
    expect(
      validationReducer(
        { results: [], inProgress: false },
        {
          type: types.SET_VALIDATION_RESULTS,
          results: [
            {
              code: 'string-maxlength',
              message:
                'Strings (non enum) must specify a maximum length. …ema `schema.maxLength` property should be defined',
              severity: 1,
            },
          ],
        }
      )
    ).toEqual({
      inProgress: false,
      results: [
        {
          code: 'string-maxlength',
          message:
            'Strings (non enum) must specify a maximum length. …ema `schema.maxLength` property should be defined',
          severity: 1,
        },
      ],
    });
  });
});
