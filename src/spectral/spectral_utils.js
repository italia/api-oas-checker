import { ERROR, WARNING } from '../utils.mjs';
import PropTypes from 'prop-types';

export const getValidationResultType = (severity) => (severity === 0 ? ERROR : WARNING);
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
  if (validationResults === null) return new Map();

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
  if (results === null) return null;

  const uniqueResultsMap = results.reduce((uniqueResultsMap, result) => {
    const key = getValidationResultKey(result);
    if (!uniqueResultsMap.has(key)) {
      uniqueResultsMap.set(key, result);
    }
    return uniqueResultsMap;
  }, new Map());
  return Array.from(uniqueResultsMap.values());
};
export const getValidationResultKey = (result) => {
  return `${result.code}-${result.severity}-${result.range.start.line}-${result.message}`;
};
