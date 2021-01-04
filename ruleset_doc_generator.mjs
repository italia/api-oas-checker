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
    description: 'The ruleset to process',
    type: 'string',
  })
  .option('title', {
    alias: 't',
    demandOption: true,
    description: 'The title of the generated doc',
    type: 'string',
  }).argv;

const content = fs.readFileSync(file, 'utf8');
const doc = yaml.parseDocument(content).toJSON();
const rulesMd = Object.entries(doc.rules).reduce(
  (rules, [key, value]) => {
    rules.push(`## ${key}\n\n${value.description}`);
    return rules;
  },
  [`# ${title}`]
);

const rulesHtml = marked(rulesMd.join('\n\n'));
const docFilename = utils.getDocFilename(file);
fs.writeFileSync(docFilename, rulesHtml);
