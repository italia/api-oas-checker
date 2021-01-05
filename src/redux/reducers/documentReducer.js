import { FOCUS_DOCUMENT_LINE, SET_DOCUMENT_URL, SET_DOCUMENT_TEXT } from '../actionTypes.js';
import { DEFAULT_DOCUMENT_URL } from '../../utils.mjs';

const initialState = {
  focusLine: null,
  text: null,
  url: DEFAULT_DOCUMENT_URL,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_DOCUMENT_TEXT:
      return {
        ...state,
        text: action.text,
        url: null, // Invalidate document url in order to allow the reload of the same url if the text has been changed
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
