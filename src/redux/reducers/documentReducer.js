import { FOCUS_DOCUMENT_LINE, SET_DOCUMENT_TEXT } from '../actionTypes.js';

const initialState = {
  focusLine: null,
  text: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_DOCUMENT_TEXT:
      return {
        ...state,
        text: action.text,
      };
    case FOCUS_DOCUMENT_LINE:
      return {
        ...state,
        focusLine: action.line,
      };
    default:
      return state;
  }
}
