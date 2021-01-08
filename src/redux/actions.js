import {
  SET_VALIDATION_RESULTS,
  TOOGLE_MENU,
  SET_VALIDATION_IN_PROGRESS,
  SET_DOCUMENT_TEXT,
  FOCUS_DOCUMENT_LINE,
  SET_DOCUMENT_URL,
  SET_RULESET,
} from './actionTypes.js';

export const toogleMenu = () => ({
  type: TOOGLE_MENU,
});

export const setValidationResults = (results) => ({
  type: SET_VALIDATION_RESULTS,
  results,
});

export const resetValidationResults = () => {
  return setValidationResults(null);
};

export const setValidationInProgress = () => ({
  type: SET_VALIDATION_IN_PROGRESS,
});

export const setRuleset = (ruleset) => ({
  type: SET_RULESET,
  ruleset,
});

export const setDocumentText = (text) => ({
  type: SET_DOCUMENT_TEXT,
  text,
});

export const focusDocumentLine = (line) => ({
  type: FOCUS_DOCUMENT_LINE,
  line,
});

export const setDocumentUrl = (url) => ({
  type: SET_DOCUMENT_URL,
  url,
});
