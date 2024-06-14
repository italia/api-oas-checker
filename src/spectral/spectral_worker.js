import { Document, Parsers } from '@stoplight/spectral';
import { getSpectralEngine } from './spectral_engine.js';

onmessage = async (e) => {
  try {
    const document = new Document(e.data.documentText, Parsers.Yaml);
    const spectral = await getSpectralEngine(e.data.ruleset);
    const originalResults = await spectral.run(document);
    const filteredResults = originalResults
      .filter((result) => e.data.onlyErrors === false || result.severity === 0)
      .sort((a, b) => a.severity - b.severity);
    // Decorate results with rule description
    const resultsWithRuleDescription = filteredResults.map((r) => ({
      ...r,
      description: spectral.rules[r.code]?.description,
    }));
    postMessage(resultsWithRuleDescription);
  } catch (e) {
    postMessage({ error: e.message });
  }
};
