import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import debounce from 'lodash.debounce';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { setDocumentText } from '../redux/actions.js';
import { getDocumentText, getDocumentUrl, getLineToFocus, getValidationResults } from '../redux/selectors.js';
import { ERROR } from '../utils.mjs';
import { getSeverityByLineMap, getValidationResultType } from '../spectral/spectral_utils.js';

const useStyles = createUseStyles({
  editor: {
    height: 'calc(100vh - 90px)',
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
  const documentText = useSelector((state) => getDocumentText(state));
  const dispatch = useDispatch();

  useEffect(() => {
    // Init Monaco
    editor.current = monaco.editor.create(editorEl.current, {
      value: '',
      language: 'yaml',
      glyphMargin: true,
      theme: 'vs-dark',
      automaticLayout: true,
    });
    editor.current.onDidChangeModelContent(
      debounce(() => {
        const text = editor.current.getModel().getValue();
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
    console.debug('Eventually update editor text.');
    if (documentText == null) {
      return null;
    }
    if (documentText === editor.current.getValue()) {
      return null;
    }
    console.log('Update editor and state text.');
    const updateDocumentText = async () => {
      editor.current.getModel().setValue(documentText);
      dispatch(setDocumentText(documentText));
    };
    updateDocumentText();
  }, [documentText, dispatch]);

  useEffect(() => {
    if (!documentUrl) {
      return null;
    }

    const loadDocumentFromUrl = async () => {
      try {
        const { data: text } = await axios.get(documentUrl);
        editor.current.getModel().setValue(text);
        dispatch(setDocumentText(text));
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    };

    loadDocumentFromUrl();
  }, [documentUrl, dispatch]);

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
            getValidationResultType(severity) === ERROR ? classes.editorMarginError : classes.editorMarginWarning,
        },
      });
    }
    decoration.current = editor.current.deltaDecorations([], newDecorations);
  }, [validationResults, classes.editorHighlightLine, classes.editorMarginError, classes.editorMarginWarning]);

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
