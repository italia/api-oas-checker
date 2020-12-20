import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import * as monaco from 'monaco-editor';
import debounce from 'lodash.debounce';
import { createUseStyles } from 'react-jss';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setDocumentText } from '../redux/actions.js';
import { getDocumentUrl, getHighlightLines, getLineToFocus } from '../redux/selectors.js';

const useStyles = createUseStyles({
  editor: {
    height: 'calc(100vh - 80px)',
    overflow: 'auto',
  },
  editorMarginHighlightSev1: {
    background: 'var(--danger)',
  },
  editorHighlightLine: {
    background: 'var(--primary)',
  },
});

const Editor = ({ highlightLines, focusLine, documentUrl, setDocumentText }) => {
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
      }, 300)
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
      const { data: text } = await axios.get(documentUrl);
      editor.current.getModel().setValue(text);
      setDocumentText(text);
    };

    loadDocumentFromUrl();
  }, [documentUrl, setDocumentText]);

  useEffect(() => {
    if (highlightLines === null) return;

    // TODO: here there is a performance issue.
    // Highlight issues
    editor.current.deltaDecorations(decoration.current, []);
    const newDecorations = [];
    for (const line of highlightLines) {
      newDecorations.push({
        range: new monaco.Range(line.start, 1, line.end, 1),
        options: {
          isWholeLine: true,
          className: classes.editorHighlightLine,
          glyphMarginClassName: classes.editorMarginHighlightSev1, // TODO: change based on severity
        },
      });
    }
    decoration.current = editor.current.deltaDecorations([], newDecorations);
  }, [highlightLines, classes.editorHighlightLine, classes.editorMarginHighlightSev1]);

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
  highlightLines: PropTypes.arrayOf(
    PropTypes.exact({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      severity: PropTypes.number.isRequired,
    })
  ),
  setDocumentText: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    highlightLines: getHighlightLines(state),
    focusLine: getLineToFocus(state),
    documentUrl: getDocumentUrl(state),
  }),
  {
    setDocumentText,
  }
)(Editor);
