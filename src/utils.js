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

export const downloadFile = (content, fileName, contentType) => {
  const anchorElement = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  anchorElement.href = URL.createObjectURL(file);
  anchorElement.download = fileName;
  anchorElement.click();
};
