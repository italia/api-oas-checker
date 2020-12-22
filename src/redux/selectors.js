import { ERROR, getResultType, WARNING } from '../utils.js';

export const getValidationSummary = (state) => {
  if (isValidationInProgress(state) || getValidationResults(state) === null) {
    return null;
  }

  const summary = {
    errors: state.validationState.results.filter((r) => getResultType(r.severity) === ERROR).length,
    warnings: state.validationState.results.filter((r) => getResultType(r.severity) === WARNING).length,
  };

  return summary;
};

export const getValidationResults = (state) => state.validationState.results;

export const isValidationInProgress = (state) => state.validationState.inProgress;

export const getRuleset = (state) => state.validationState.ruleset;

export const getValidationResultsInfo = (state) => {
  if (isValidationInProgress(state) || getValidationResults(state) === null) {
    return null;
  }

  const resultsInfo = state.validationState.results.map((r) => ({
    fingerprint: r.fingerprint,
    severity: r.severity,
    line: r.range.start.line,
    character: r.range.start.character,
    message: r.message,
  }));

  return resultsInfo;
};

export const isMenuDisplayed = (state) => state.menuState.isMenuDisplayed;

export const getDocumentText = (state) => state.documentState.text;
export const getDocumentUrl = (state) => state.documentState.url;

export const getHighlightLines = (state) => {
  if (isValidationInProgress(state) || getValidationResults(state) === null) {
    return null;
  }
  const results = getValidationResults(state);
  return results.map((r) => ({
    start: r.range.start.line,
    end: r.range.end.line,
    severity: r.severity,
  }));
};

export const getLineToFocus = (state) => state.documentState.focusLine;
