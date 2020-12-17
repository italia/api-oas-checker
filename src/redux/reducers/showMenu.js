import { TOOGLE_MENU } from '../actionTypes.js';

const initialState = true;

export default function (state = initialState, action) {
  switch (action.type) {
    case TOOGLE_MENU:
      return !state;
      break;
    default:
      return state;
  }
}