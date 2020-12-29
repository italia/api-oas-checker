import PropTypes from 'prop-types';

export const ERROR = 'error';
export const WARNING = 'warning';
export const DEFAULT_DOCUMENT_URL = 'example.yaml';
export const TEMPLATE_DOCUMENT_URL =
  'https://raw.githubusercontent.com/teamdigitale/api-starter-kit/master/openapi/simple.yaml.src';
export const RULESET_ITALIAN = 'spectral.yml';
export const RULESET_BEST_PRACTICES = 'spectral-generic.yml';
export const RULESET_SECURITY = 'spectral-security.yml';
export const RULESET_ITALIAN_PLUS_SECURITY = 'spectral-full.yml';
export const DEFAULT_RULESET = RULESET_ITALIAN;

export const getValidationResultType = (severity) => (severity === 0 ? ERROR : WARNING);

export const downloadFile = (content, fileName, contentType) => {
  const anchorElement = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  anchorElement.href = URL.createObjectURL(file);
  anchorElement.download = fileName;
  anchorElement.click();
};

export const getValidationResultsPropTypes = () => PropTypes.arrayOf(getValidationResultItemPropTypes());

export const getValidationResultItemPropTypes = () =>
  PropTypes.shape({
    range: PropTypes.exact({
      start: PropTypes.object,
      end: PropTypes.shape({
        line: PropTypes.number.isRequired,
        character: PropTypes.number.isRequired,
      }),
    }),
    message: PropTypes.string.isRequired,
    severity: PropTypes.number.isRequired,
  });

export const getValidationResultLine = (result) => result.range.start.line + 1;

/**
 * Returns a map of that contains association between line and corresponding error severity.
 * It reduces several severities that could insist on the same line to one, giving more priority to error severity.
 */
export const getSeverityByLineMap = (validationResults) => {
  const lineSeverityMap = validationResults.reduce((lineSeverityMap, result) => {
    const line = getValidationResultLine(result);
    if (!lineSeverityMap.has(line)) {
      lineSeverityMap.set(line, result.severity);
      return lineSeverityMap;
    }

    if (getValidationResultType(result.severity) === ERROR) {
      lineSeverityMap.set(line, result.severity);
    }
    return lineSeverityMap;
  }, new Map());

  return lineSeverityMap;
};

// https://github.com/italia/api-oas-checker/issues/79
export const getUniqueValidationResults = (results) => {
  const uniqueResultsMap = results.reduce((uniqueResultsMap, result) => {
    const key = getValidationResultKey(result);
    if (!uniqueResultsMap.has(key)) {
      uniqueResultsMap.set(key, result);
    }
    return uniqueResultsMap;
  }, new Map());
  return uniqueResultsMap.values();
};

export const getValidationResultKey = (result) => {
  return `${result.code}-${result.severity}-${result.range.start.line}-${result.message}`;
};
