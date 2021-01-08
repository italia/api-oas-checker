import { TOOGLE_MENU } from '../actionTypes.js';

const initialState = {
  isMenuDisplayed: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOOGLE_MENU:
      return {
        isMenuDisplayed: !state.isMenuDisplayed,
      };
    default:
      return state;
  }
}
