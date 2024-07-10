// This module has .mjs extension because it's shared with a nodejs script written with esm syntax
// I've tried to set package.json to 'module' but webpack didn't work anymore
// As a quick fix I've used .mjs extension here and in the nodejs script which depends on this module

import LZString from 'lz-string';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export const getDocFilename = (ruleset) => {
  const docFilename = ruleset.split('.')[0];
  return `${docFilename}.html`;
};

// See spectral DiagnosticSeverity values.
export const ERROR = 'error';
export const WARNING = 'warning';
export const INFO = 'info';
export const HINT = 'hint';
export const DEFAULT_DOCUMENT_URL = 'initial.yaml';
export const TEMPLATE_DOCUMENT_URL =
  'https://raw.githubusercontent.com/teamdigitale/api-starter-kit/master/openapi/simple.yaml.src';

export const downloadFile = (content, fileName, contentType) => {
  const anchorElement = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  anchorElement.href = URL.createObjectURL(file);
  anchorElement.download = fileName;
  anchorElement.click();
};

export const autoLinkRFC = (text) => text.replace(/(rfc[0-9]+)/gi, '[$1](https://tools.ietf.org/html/$1)');
export const b64url_encode = (buf) => LZString.compressToEncodedURIComponent(buf);
export const b64url_decode = (s) => LZString.decompressFromEncodedURIComponent(s);
export function renderMarkdown(text) {
  return DOMPurify.sanitize(marked(text), {
    USE_PROFILES: { html: true },
  });
}
