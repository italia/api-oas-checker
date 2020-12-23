import PropTypes from 'prop-types';

export const ERROR = 'error';
export const WARNING = 'warning';
export const DEFAULT_DOCUMENT_URL = 'example.yaml';
export const TEMPLATE_DOCUMENT_URL = 'template.yaml';
export const RULESET_ITALIAN = 'ruleset-italian.yaml';
export const RULESET_BEST_PRACTICES = 'ruleset-best-practices.yaml';
export const RULESET_SECURITY = 'ruleset-security.yaml';
export const RULESET_ITALIAN_PLUS_SECURITY = 'ruleset-italian-plus-security.yaml';
export const DEFAULT_RULESET = RULESET_ITALIAN_PLUS_SECURITY;

export const getResultType = (severity) => (severity === 0 ? ERROR : WARNING);

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
    fingerprint: PropTypes.string.isRequired,
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
