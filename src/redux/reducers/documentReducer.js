import { FOCUS_DOCUMENT_LINE, SET_DOCUMENT_URL, SET_DOCUMENT_TEXT } from '../actionTypes.js';

const initialState = {
  focusLine: null,
  text: null,
  url: null,
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
    case SET_DOCUMENT_URL:
      return {
        ...state,
        url: action.url,
      };
    default:
      return state;
  }
}
