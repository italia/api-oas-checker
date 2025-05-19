import {
  FOCUS_DOCUMENT_LINE,
  SET_DOCUMENT_URL,
  SET_DOCUMENT_TEXT,
  SET_DOCUMENT_FILE,
  SET_FILENAME,
} from "../actionTypes.js";
import { DEFAULT_DOCUMENT_URL } from "../../utils.mjs";

// Replace query string with fragment
const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Get params from fragment

const initialState = {
  focusLine: null,
  text: null,
  file: null,
  filename: null,
  textParameter: hashParams.get("text") || null, // Get 'text' from fragment
  url: hashParams.get("text")
    ? null
    : hashParams.get("url") || DEFAULT_DOCUMENT_URL, // Get 'url' from fragment or use default
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_DOCUMENT_TEXT:
      return {
        ...state,
        text: action.text,
        textParameter: null,
        url: null, // Invalidate document url in order to allow the reload of the same url if the text has been changed
      };
    case FOCUS_DOCUMENT_LINE:
      return {
        ...state,
        focusLine: action.line,
      };
    case SET_DOCUMENT_FILE:
      return {
        ...state,
        file: action.payload,
        url: null,
        textParameter: null,
      };
    case SET_FILENAME:
      return {
        ...state,
        filename: action.payload,
        url: null,
        textParameter: null,
      };
    case SET_DOCUMENT_URL:
      return {
        ...state,
        url: action.url,
        textParameter: null,
      };
    default:
      return state;
  }
}
