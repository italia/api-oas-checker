import { SET_VALIDATION_RESULTS, SET_VALIDATION_IN_PROGRESS } from '../actionTypes.js';

const initialState = {
  results: null, // null to explicitly declare that the results are not available
  inProgress: false,
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
        results: null, // TODO: check this
        inProgress: true,
      };
    default:
      return state;
  }
}
