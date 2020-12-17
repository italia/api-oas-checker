import { SET_VALIDATION_RESULTS } from '../actionTypes.js';

const initialState = null;

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VALIDATION_RESULTS:
      return action.payload;
      break;
    default:
      return state;
  }
}