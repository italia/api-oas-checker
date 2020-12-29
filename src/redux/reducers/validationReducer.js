import { SET_VALIDATION_RESULTS, SET_VALIDATION_IN_PROGRESS, SET_RULESET } from '../actionTypes.js';
import { DEFAULT_RULESET } from '../../utils.js';

const initialState = {
  results: null, // null to explicitly declare that the results are not available
  inProgress: false,
  ruleset: DEFAULT_RULESET,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VALIDATION_RESULTS:
      return {
        ...state,
        inProgress: false,
        results: action.results,
      };
    case SET_VALIDATION_IN_PROGRESS:
      return {
        ...state,
        results: null,
        inProgress: true,
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
