#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import yaml from 'yaml';
import marked from 'marked';
import utils from './src/utils.mjs';

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

    rules.push(`## ${key}\n\n${value.description}`);
    return rules;
  },
  [`# ${title}`]
);

const rulesHtml = marked(rulesMd.join('\n\n'));
const docFilename = utils.getDocFilename(file);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lora&family=Source+Code+Pro&display=swap" rel="stylesheet">
    <style>
    * {
      font-family: 'Lora', serif;
    }
    
    body {
      width: 75vw;
      margin: 17px auto;
    }
    
    h1 {
      margin: 10px;
    }
    
    h2, h3, h4, h5, h6 {
      margin: 20px;
    }
    
    p {
      margin: 30px;
    }
    
    </style>
    <title>${title}</title>
</head>
<body>
${rulesHtml}
</body>
</html>`;

fs.writeFileSync(docFilename, html);
