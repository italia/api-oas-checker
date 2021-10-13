import { Spectral } from '@stoplight/spectral-core';

const spectral = new Spectral();
let currentRuleset = null;

export const getSpectralEngine = async (ruleset) => {
  if (ruleset !== currentRuleset) {
    const r = ruleset + '.js';
    console.log('ruleset', r);
    await spectral.setRuleset(require('spectral.yml.js'));
    currentRuleset = ruleset;
  }
  return spectral;
};
