import { isOpenApiv3, Spectral } from '@stoplight/spectral';

const init = async () => {
  const spectral = new Spectral();
  spectral.registerFormat('oas3', isOpenApiv3);
  await spectral.loadRuleset(`${location.href}ruleset-extra-security.yaml`);  // TODO: this must be dynamic
  return spectral;
}

export const getSpectral = init;