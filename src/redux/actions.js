import {
  SET_VALIDATION_RESULTS,
  TOOGLE_MENU,
  SET_VALIDATION_IN_PROGRESS,
  SET_DOCUMENT_TEXT,
  FOCUS_DOCUMENT_LINE,
} from './actionTypes.js';

export const toogleMenu = () => ({
  type: TOOGLE_MENU,
});

export const setValidationResults = (results) => ({
  type: SET_VALIDATION_RESULTS,
  results,
});

export const setValidationInProgress = () => ({
  type: SET_VALIDATION_IN_PROGRESS,
});

export const setDocumentText = (text) => ({
  type: SET_DOCUMENT_TEXT,
  text,
});

export const focusDocumentLine = (line) => {
  return {
    type: FOCUS_DOCUMENT_LINE,
    line,
  };
};
