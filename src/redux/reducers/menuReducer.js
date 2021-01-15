import { TOOGLE_MENU } from '../actionTypes.js';

const initialState = {
  isMenuDisplayed: true,
};

export default function (state = initialState, action) {
  if (action.type === TOOGLE_MENU) {
    return {
      isMenuDisplayed: !state.isMenuDisplayed,
    };
  }

  return state;
}
