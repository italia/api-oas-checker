import { SET_VALIDATION_RESULTS, SET_VALIDATION_IN_PROGRESS, SET_RULESET } from '../actionTypes.js';
import { getUniqueValidationResults } from '../../spectral/spectral_utils.js';

const initialState = {
  results: null, // null to explicitly declare that the results are not available ([] -> when there are no errors)
  rawResults: null, // https://github.com/italia/api-oas-checker/issues/79
  inProgress: false,
  ruleset: DEFAULT_RULESET,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VALIDATION_RESULTS:
      return {
        ...state,
        inProgress: false,
        rawResults: action.results,
        results: getUniqueValidationResults(action.results),
      };
    case SET_VALIDATION_IN_PROGRESS:
      return {
        ...state,
        inProgress: true,
        rawResults: null,
        results: null,
      };
    case SET_RULESET:
      return {
        ...state,
        ruleset: action.ruleset,
      };
    default:
      return state;
  }
}
