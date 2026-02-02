import { useEffect, useRef, useState, useCallback } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { setDiagnosticsOptions } from 'monaco-yaml';
import debounce from 'lodash.debounce';

export const useMonaco = (containerRef, onContentChange) => {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);

  // Debounced change handler
  const debouncedChangeHandler = useCallback(
    debounce((editor) => {
      const text = editor.getModel().getValue();
      if (onContentChange) {
        onContentChange(text);
      }
    }, 1000),
    [onContentChange]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Configure YAML diagnostics
    setDiagnosticsOptions({
      enableSchemaRequest: true,
      hover: true,
      completion: true,
      validate: true,
      format: true,
      schemas: [
        {
          uri: 'oas3-completion.schema.json',
          fileMatch: ['*'],
        },
      ],
    });

    // Initialize Monaco
    const editor = monaco.editor.create(containerRef.current, {
      value: '',
      language: 'yaml',
      glyphMargin: true,
      theme: 'vs-dark',
      automaticLayout: true,
    });

    editor.getModel().updateOptions({
      tabSize: 2,
    });

    // Add top padding
    editor.changeViewZones((accessor) => {
      accessor.addZone({
        afterLineNumber: 0,
        heightInPx: 20,
        domNode: document.createElement('span'),
      });
    });

    // Bind change event
    const disposable = editor.onDidChangeModelContent(() => {
      debouncedChangeHandler(editor);
    });

    editorRef.current = editor;
    setEditorInstance(editor);

    // Cleanup
    return () => {
      disposable.dispose();
      editor.dispose();
      debouncedChangeHandler.cancel(); // Cancel pending debounced calls
      editorRef.current = null;
      setEditorInstance(null);
    };
  }, [containerRef, debouncedChangeHandler]);

  return editorInstance;
};
