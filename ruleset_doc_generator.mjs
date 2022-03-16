#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { marked } from 'marked';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { getDocFilename, autoLinkRFC } from './src/utils.mjs';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const { file, title } = yargs(hideBin(process.argv))
  .option('file', {
    alias: 'f',
    demandOption: true,
    description: 'The ruleset file used for making doc',
    type: 'string',
  })
  .option('title', {
    alias: 't',
    demandOption: true,
    description: 'The title of the output doc',
    type: 'string',
  }).argv;

const content = fs.readFileSync(file, 'utf8');
const doc = yaml.parseDocument(content).toJSON();
const rulesMd = Object.entries(doc.rules).reduce(
  (rules, [key, value]) => {
    // https://github.com/italia/api-oas-checker/issues/122
    if (value === false) return rules;

    if (value.description === undefined)
      throw new Error(`Rule ${key} doesn't have a description. Rule description is a required field`);

    const description = autoLinkRFC(value.description);
    rules.push(`## ${key}\n\n${description}`);
    return rules;
  },
  [`# ${title}`]
);

const rulesHtml = DOMPurify.sanitize(marked.parse(rulesMd.join('\n\n')), { USE_PROFILES: { html: true } });
const docFilename = getDocFilename(file);

const boostrapCss = fs.readFileSync(
  path.resolve(path.dirname(''), 'node_modules/bootstrap-italia/dist/css/bootstrap-italia.min.css'),
  'utf-8'
);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <style>
    ${boostrapCss}
    h2, h3 {
        color: var(--primary)
    }
    h1, h2 {
        margin: 30px 0;
    }
    h3 {
        margin: 48px 0 24px 0;
    }
    </style>
    <title>${title}</title>
</head>
<body>
<div class="container">
    <div class="row">
        <div style="margin: auto" class="col-xs-12 col-sm-10 col-md-8 col-lg-6">
            ${rulesHtml}
        </div>
    </div>
</div>
</body>
</html>`;

fs.writeFileSync(docFilename, html);
