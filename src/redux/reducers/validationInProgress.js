import { SET_VALIDATION_IN_PROGRESS } from '../actionTypes.js';

const initialState = false;

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VALIDATION_IN_PROGRESS:
      return action.payload;
      break;
    default:
      return state;
  }
}