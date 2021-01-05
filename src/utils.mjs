// This module has .mjs extension because it's shared with a nodejs script written with esm syntax
// I've tried to set package.json to 'module' but webpack didn't work anymore
// As a quick fix I've used .mjs extension here and in the nodejs script which depends on this module

export const getDocFilename = (ruleset) => {
  const docFilename = ruleset.split('.')[0]; // Use path-browserify if file name extraction becomes more complex
  return `${docFilename}.doc.html`;
};

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

export default { getDocFilename };
