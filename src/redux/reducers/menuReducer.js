import { TOOGLE_MENU } from '../actionTypes.js';

const initialState = {
  showMenu: true
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOOGLE_MENU:
      return {
        showMenu: !state.showMenu
      }
      break;
    default:
      return state;
  }
}