import { isOpenApiv3, Spectral } from '@stoplight/spectral';

const spectral = new Spectral();
spectral.registerFormat('oas3', isOpenApiv3);
let currentRuleset = null;

export const getSpectralEngine = async (ruleset) => {
  if (ruleset !== currentRuleset) {
    await spectral.loadRuleset(`${location.origin}/${ruleset}`);
    currentRuleset = ruleset;
  }
  return spectral;
};
