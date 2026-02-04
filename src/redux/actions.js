import {
	FOCUS_DOCUMENT_LINE,
	SET_AUTO_REFRESH,
	SET_DOCUMENT_FILE,
	SET_DOCUMENT_TEXT,
	SET_DOCUMENT_URL,
	SET_FILENAME,
	SET_ONLY_ERRORS,
	SET_RULESET,
	SET_TEMPLATE_DOCUMENT_NAME,
	SET_VALIDATION_IN_PROGRESS,
	SET_VALIDATION_RESULTS,
	TRIGGER_FORMAT,
} from './actionTypes.js';

export const setOnlyErrors = (onlyErrors) => ({
  type: SET_ONLY_ERRORS,
  onlyErrors,
});

export const setAutoRefresh = (autoRefresh) => ({
  type: SET_AUTO_REFRESH,
  autoRefresh,
});

export const triggerFormat = (tabSize) => ({
  type: TRIGGER_FORMAT,
  tabSize,
});

export const setValidationResults = (results) => ({
  type: SET_VALIDATION_RESULTS,
  results,
});

export const resetValidationResults = () => setValidationResults(null);

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

export const setDocumentFile = (file) => ({
  type: SET_DOCUMENT_FILE,
  payload: file,
});

export const setFilename = (filename) => ({
  type: SET_FILENAME,
  payload: filename,
});

export const focusDocumentLine = (line) => ({
  type: FOCUS_DOCUMENT_LINE,
  line,
});

export const setDocumentUrl = (url) => ({
  type: SET_DOCUMENT_URL,
  url,
});

export const setTemplateDocumentName = (ruleset) => ({
  type: SET_TEMPLATE_DOCUMENT_NAME,
  ruleset,
});
