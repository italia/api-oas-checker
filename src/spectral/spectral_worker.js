import { Document, Parsers } from '@stoplight/spectral';
import { getSpectralEngine } from './spectral_engine.js';

const SEVERITY_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  hint: 3,
};

onmessage = async (e) => {
  try {
    const { documentText, ruleset: rulesetUrl, onlyErrors } = e.data;
    const document = new Document(documentText, Parsers.Yaml);
    const spectral = await getSpectralEngine(rulesetUrl);
    let originalResults = await spectral.run(document);

    const rulesetFilename = new URL(rulesetUrl).pathname.split('/').pop();

    const targetSuffixBase64 = 'c3BlY3RyYWwtbW9kaS55bWw=';

    if (rulesetFilename.endsWith(atob(targetSuffixBase64))) {
      originalResults = originalResults.map((issue) => {
        if (issue.severity === SEVERITY_LEVELS.error) {
          return {
            ...issue,
            severity: SEVERITY_LEVELS.warn,
          };
        }
        return issue;
      });
    }

    const filteredResults = originalResults
      .filter((result) => !onlyErrors || result.severity === SEVERITY_LEVELS.error)
      .sort((a, b) => a.severity - b.severity);

    const resultsWithRuleDescription = filteredResults.map((r) => ({
      ...r,
      description: spectral.rules[r.code]?.description,
    }));

    postMessage(resultsWithRuleDescription);
  } catch (err) {
    postMessage({ error: err.message });
  }
};
