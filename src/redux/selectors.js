export const getValidationSummary = (state) => {
  if (isValidationInProgress(state) || getValidationResults(state) === null) {
    return null;
  }

  const summary = {
    errors: state.validationState.results.filter((r) => r.severity === 1).length,
    warnings: state.validationState.results.filter((r) => r.severity !== 1).length,
  };

  return summary;
};

export const getValidationResults = (state) => state.validationState.results;

export const isValidationInProgress = (state) => state.validationState.inProgress;

export const getValidationResultsInfo = (state) => {
  if (isValidationInProgress(state) || getValidationResults(state) === null) {
    return []; // TODO: is this correct?
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

export const getHighlightLines = (state) => {
  if (isValidationInProgress(state) || getValidationResults(state) === null) {
    return []; // TODO: is this correct?
  }
  const results = getValidationResults(state);
  return results.map((r) => ({
    start: r.range.start.line,
    end: r.range.end.line,
    severity: r.severity,
  }));
};

export const getLineToFocus = (state) => state.documentState.focusLine;
