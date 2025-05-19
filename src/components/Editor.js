import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { setDiagnosticsOptions } from 'monaco-yaml';
import debounce from 'lodash.debounce';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { setDocumentText, setFilename } from '../redux/actions.js';
import {
  getDocumentTextParameter,
  getDocumentUrl,
  getDocumentFile,
  getLineToFocus,
  getValidationResults,
} from '../redux/selectors.js';
import { ERROR, WARNING, INFO, HINT, b64url_decode } from '../utils.mjs';
import { getSeverityByLineMap, getValidationResultType } from '../spectral/spectral_utils.js';

const useStyles = createUseStyles({
  editor: {
    height: 'calc(100vh - 90px)',
  },
  editorMarginHint: {
    backgroundColor: 'var(--light)',
  },
  editorMarginInfo: {
    backgroundColor: 'var(--info)',
  },
  editorMarginError: {
    backgroundColor: 'var(--danger)',
  },
  editorMarginWarning: {
    backgroundColor: 'var(--warning)',
  },
  editorHighlightLine: {
    backgroundColor: 'var(--primary)',
  },
});

const Editor = () => {
  const editorEl = useRef(null);
  const editor = useRef({});
  const decoration = useRef([]);
  const classes = useStyles();
  const validationResults = useSelector((state) => getValidationResults(state));
  const focusLine = useSelector((state) => getLineToFocus(state));
  const documentUrl = useSelector((state) => getDocumentUrl(state));
  const documentFile = useSelector((state) => getDocumentFile(state));
  const documentTextParameter = useSelector((state) => getDocumentTextParameter(state));
  const dispatch = useDispatch();

  useEffect(() => {
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

    // Init Monaco
    editor.current = monaco.editor.create(editorEl.current, {
      value: '',
      language: 'yaml',
      glyphMargin: true,
      theme: 'vs-dark',
      automaticLayout: true,
    });
    editor.current.getModel().updateOptions({
      tabSize: 2,
    });
    editor.current.onDidChangeModelContent(
      debounce(() => {
        const text = editor.current.getModel().getValue();
        // If the editor is empty delete the filename section
        if (text.trim() === '') {
          dispatch(setFilename(null));
        }
        dispatch(setDocumentText(text));
      }, 1000)
    );
    // Add some space on top of the editor
    editor.current.changeViewZones((accessor) => {
      accessor.addZone({
        afterLineNumber: 0,
        heightInPx: 20,
        domNode: document.createElement('span'),
      });
    });
  }, [dispatch]);

  useEffect(() => {
    const loadDocumentFromUrl = async (documentUrl) => {
      try {
        const { data: text } = await axios.get(documentUrl);
        editor.current.getModel().setValue(text);
        dispatch(setDocumentText(text));
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    };

    const loadDocumentFromFile = async (documentFile) => {
      try {
        editor.current.getModel().setValue(documentFile.toString());
        dispatch(setDocumentText(documentFile.toString()));
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    };

    const loadDocumentFromTextParam = (textParam) => {
      try {
        const { data: text } = { data: b64url_decode(textParam) };
        editor.current.getModel().setValue(text);
        dispatch(setDocumentText(text));
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    };

    if (documentTextParameter) {
      loadDocumentFromTextParam(documentTextParameter);
    } else if (documentUrl) {
      loadDocumentFromUrl(documentUrl);
    } else if (documentFile) {
      loadDocumentFromFile(documentFile);
    }
  }, [documentUrl, documentFile, documentTextParameter, dispatch]);

  useEffect(() => {
    if (validationResults === null) {
      decoration.current = editor.current.deltaDecorations(decoration.current, []);
      return;
    }

    const lineSeverityMap = getSeverityByLineMap(validationResults);

    // Highlight issues
    editor.current.deltaDecorations(decoration.current, []);
    const newDecorations = [];
    for (const [line, severity] of lineSeverityMap.entries()) {
      newDecorations.push({
        range: new monaco.Range(Number(line), 1, Number(line), 1),
        options: {
          glyphMarginClassName:
            getValidationResultType(severity) === ERROR
              ? classes.editorMarginError
              : getValidationResultType(severity) === WARNING
              ? classes.editorMarginWarning
              : getValidationResultType(severity) === INFO
              ? classes.editorMarginInfo
              : getValidationResultType(severity) === HINT
              ? classes.editorMarginHint
              : classes.editorMarginError,
        },
      });
    }
    decoration.current = editor.current.deltaDecorations([], newDecorations);
  }, [
    validationResults,
    classes.editorHighlightLine,
    classes.editorMarginError,
    classes.editorMarginWarning,
    classes.editorMarginInfo,
    classes.editorMarginHint,
  ]);

  useEffect(() => {
    if (!focusLine) {
      return;
    }
    // Reveal line
    editor.current.revealLineInCenter(focusLine.line);
    editor.current.setPosition({ lineNumber: focusLine.line, column: focusLine.character });
    editor.current.focus();
  }, [focusLine]);

  return <div ref={editorEl} className={classes.editor}></div>;
};

export default Editor;
