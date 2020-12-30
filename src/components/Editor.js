import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import debounce from 'lodash.debounce';
import { createUseStyles } from 'react-jss';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setDocumentText } from '../redux/actions.js';
import { getDocumentUrl, getLineToFocus, getValidationResults } from '../redux/selectors.js';
import { ERROR } from '../utils.js';
import {
  getSeverityByLineMap,
  getValidationResultsPropTypes,
  getValidationResultType,
} from '../spectral/spectral_utils.js';

const useStyles = createUseStyles({
  editor: {
    height: 'calc(100vh - 90px)',
    overflow: 'auto',
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

const Editor = ({ validationResults, focusLine, documentUrl, setDocumentText }) => {
  const editorEl = useRef(null);
  const editor = useRef({});
  const decoration = useRef([]);
  const classes = useStyles();

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
        setDocumentText(text);
      }, 500)
    );
    // Add some space on top of the editor
    editor.current.changeViewZones((accessor) => {
      accessor.addZone({
        afterLineNumber: 0,
        heightInPx: 20,
        domNode: document.createElement('span'),
      });
    });
  }, [setDocumentText]);

  useEffect(() => {
    if (!documentUrl) return null;

    const loadDocumentFromUrl = async () => {
      try {
        const { data: text } = await axios.get(documentUrl);
        editor.current.getModel().setValue(text);
        setDocumentText(text);
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    };

    loadDocumentFromUrl();
  }, [documentUrl, setDocumentText]);

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
    if (!focusLine) return;
    // Reveal line
    editor.current.revealLineInCenter(focusLine.line);
    editor.current.setPosition({ lineNumber: focusLine.line, column: focusLine.character });
    editor.current.focus();
  }, [focusLine]);

  return <div ref={editorEl} className={classes.editor}></div>;
};

Editor.propTypes = {
  focusLine: PropTypes.shape({
    line: PropTypes.number.isRequired,
    character: PropTypes.number.isRequired,
  }),
  documentUrl: PropTypes.string,
  setDocumentText: PropTypes.func.isRequired,
  validationResults: getValidationResultsPropTypes(),
};

export default connect(
  (state) => ({
    validationResults: getValidationResults(state),
    focusLine: getLineToFocus(state),
    documentUrl: getDocumentUrl(state),
  }),
  {
    setDocumentText,
  }
)(Editor);
