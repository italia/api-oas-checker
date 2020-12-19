import { FOCUS_DOCUMENT_LINE, SET_DOCUMENT_TEXT } from '../actionTypes.js';

const initialState = {
  text: '',
  focusDocumentLine: null,
};

export default function (state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case SET_DOCUMENT_TEXT:
      return {
        ...state,
        text: action.text,
      };
    case FOCUS_DOCUMENT_LINE:
      return {
        ...state,
        focusDocumentLine: action.line,
      };
    default:
      return state;
  }
}
