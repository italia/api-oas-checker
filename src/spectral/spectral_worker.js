import { Document, Parsers } from '@stoplight/spectral';
import { getSpectralEngine } from './spectral_engine.js';

onmessage = async (e) => {
  try {
    const document = new Document(e.data.documentText, Parsers.Yaml);
    const spectral = await getSpectralEngine(e.data.ruleset);
    const originalResults = await spectral.run(document);
    // Decorate results with rule description
    const resultsWithRuleDescription = originalResults.map((r) => ({
      ...r,
      description: spectral.rules[r.code]?.description,
    }));
    postMessage(resultsWithRuleDescription);
  } catch (e) {
    postMessage({ error: e.message });
  }
};
