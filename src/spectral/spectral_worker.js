import { getSpectralEngine } from './spectral_engine.js';
import { Document, Parsers } from '@stoplight/spectral';

onmessage = async (e) => {
  try {
    const document = new Document(e.data.documentText, Parsers.Yaml);
    const spectral = await getSpectralEngine(e.data.ruleset);
    const results = await spectral.run(document);
    postMessage(results);
  } catch (e) {
    postMessage({ error: e.message });
  }
};
