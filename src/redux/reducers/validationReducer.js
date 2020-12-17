import { SET_VALIDATION_RESULTS, SET_VALIDATION_IN_PROGRESS } from '../actionTypes.js';

const initialState = {
  results: null,  // null to explicitly declare that the results are never been calculated
  inProgress: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VALIDATION_RESULTS:
      return {
        ...state,
        results: action.results
      };
      break;
    case SET_VALIDATION_IN_PROGRESS:
      return {
        ...state,
        inProgress: action.inProgress
      }
    default:
      return state;
  }
}