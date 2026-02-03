import { Spectral, Ruleset } from '@stoplight/spectral-core';
import { Yaml } from '@stoplight/spectral-parsers';
import { oas } from '@stoplight/spectral-rulesets';
import * as spectralFunctions from '@stoplight/spectral-functions';
import * as spectralFormats from '@stoplight/spectral-formats';
import axios from 'axios';

const spectral = new Spectral();
let currentRuleset = null;

function replaceFunctions(rules) {
  if (!rules) return;
  for (const ruleName in rules) {
    const rule = rules[ruleName];
    if (rule.then) {
      if (Array.isArray(rule.then)) {
        rule.then.forEach((then) => {
          if (typeof then.function === 'string' && spectralFunctions[then.function]) {
            then.function = spectralFunctions[then.function];
          }
        });
      } else {
        if (typeof rule.then.function === 'string' && spectralFunctions[rule.then.function]) {
          rule.then.function = spectralFunctions[rule.then.function];
        }
      }
    }
  }
}

function replaceFormats(rules) {
  if (!rules) return;
  for (const ruleName in rules) {
    const rule = rules[ruleName];
    if (rule.formats && Array.isArray(rule.formats)) {
      rule.formats = rule.formats.map((format) => {
        if (typeof format === 'string' && spectralFormats[format]) {
          return spectralFormats[format];
        }
        return format;
      });
    }
  }
}

export const getSpectralEngine = async (ruleset) => {
  if (ruleset !== currentRuleset) {
    const response = await axios.get(ruleset, { responseType: 'text' });
    const rulesetDefinition = Yaml.parse(response.data);

    const data = rulesetDefinition.data;
    if (data) {
      if (data.extends === 'spectral:oas') {
        data.extends = oas;
      } else if (Array.isArray(data.extends)) {
        data.extends = data.extends.map((e) => (e === 'spectral:oas' ? oas : e));
      }

      if (data.rules) {
        replaceFunctions(data.rules);
        replaceFormats(data.rules);
      }
    }

    try {
      const rulesetInstance = new Ruleset(data, { source: ruleset });
      spectral.setRuleset(rulesetInstance);
      currentRuleset = ruleset;
    } catch (e) {
      console.error('Failed to create Ruleset:', e);
      if (e.errors) {
        console.error('Ruleset validation errors:', e.errors);
      }
      throw e;
    }
  }
  return spectral;
};
