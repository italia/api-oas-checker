export const getValidationResults = (state) => state.validationState.results;
export const getRawValidationResults = (state) => state.validationState.rawResults;

export const isValidationInProgress = (state) => state.validationState.inProgress;

export const getRuleset = (state) => state.validationState.ruleset;
export const getOnlyErrors = (state) => state.validationState.onlyErrors;
export const getAutoRefresh = (state) => state.validationState.autoRefresh;

export const getDocumentText = (state) => state.documentState.text;
export const getDocumentFile = (state) => state.documentState.file;
export const getFilename = (state) => state.documentState.filename;
export const getDocumentTextParameter = (state) => state.documentState.textParameter;
export const getDocumentUrl = (state) => state.documentState.url;

export const getLineToFocus = (state) => state.documentState.focusLine;

export const getFormatting = (state) => state.documentState.formatting;
