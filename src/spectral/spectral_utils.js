import PropTypes from 'prop-types';
import { ERROR, HINT, WARNING } from '../utils.mjs';

export const getValidationResultType = (severity) => {
  switch (severity) {
    case 0:
      return ERROR;
    case 1:
      return WARNING;
    case 2:
      return WARNING;
    case 3:
      return HINT;
    default:
      return ERROR;
  }
};
export const getValidationResultsPropTypes = () => PropTypes.arrayOf(getValidationResultItemPropTypes());
export const getValidationResultItemPropTypes = () =>
  PropTypes.shape({
    code: PropTypes.string.isRequired,
    description: PropTypes.string,
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
 * Returns a map which contains association between lines and corresponding error severities.
 * It reduces several severities that could insist on the same line to one, giving more priority to the highest severity.
 */
export const getSeverityByLineMap = (validationResults) => {
  if (validationResults === null) {
    return new Map();
  }

  return validationResults.reduce((lineSeverityMap, result) => {
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
};
// https://github.com/italia/api-oas-checker/issues/79
export const getUniqueValidationResults = (results) => {
  if (results === null) {
    return null;
  }

  const uniqueResultsMap = results.reduce((uniqueResultsMap, result) => {
    const key = getValidationResultKey(result);
    if (!uniqueResultsMap.has(key)) {
      uniqueResultsMap.set(key, result);
    }
    return uniqueResultsMap;
  }, new Map());
  return Array.from(uniqueResultsMap.values());
};
export const getValidationResultKey = (result) =>
  `${result.code}-${result.severity}-${result.range.start.line}-${result.message}`;
