export const getValidationSummary = state => {
  const results = state.validationResults;
  if (!results) return {
    errors: null,
    warnings: null,
  };

  return {
    errors: results.filter(r => r.severity === 1),
    warnings: results.filter(r => r.severity !== 1)
  }
}

export const getValidationResultsInfo = state => {
  const results = state.validationResults;
  if (!results) return [];

  const resultsInfo = results.map(r => ({
    fingerprint: r.fingerprint,
    severity: r.severity,
    line: r.range.start.line,
    character: r.range.start.character,
    message: r.message
  }));

  return resultsInfo;
}