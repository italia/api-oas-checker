import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { getSeverityByLineMap, getValidationResultType } from '../spectral/spectral_utils.js';
import { ERROR, WARNING, INFO, HINT } from '../utils.mjs';

export const useEditorDecorations = (editorInstance, validationResults, classes) => {
  const decorationsRef = useRef([]);

  useEffect(() => {
    if (!editorInstance) return;

    // Clear decorations if no results
    if (validationResults === null) {
      decorationsRef.current = editorInstance.deltaDecorations(decorationsRef.current, []);
      return;
    }

    const lineSeverityMap = getSeverityByLineMap(validationResults);
    const newDecorations = [];

    for (const [line, severity] of lineSeverityMap.entries()) {
      const type = getValidationResultType(severity);
      let className = classes.editorMarginError;

      if (type === WARNING) className = classes.editorMarginWarning;
      else if (type === INFO) className = classes.editorMarginInfo;
      else if (type === HINT) className = classes.editorMarginHint;

      newDecorations.push({
        range: new monaco.Range(Number(line), 1, Number(line), 1),
        options: {
          glyphMarginClassName: className,
        },
      });
    }

    // Update decorations in one go
    decorationsRef.current = editorInstance.deltaDecorations(decorationsRef.current, newDecorations);

  }, [editorInstance, validationResults, classes]);
};
