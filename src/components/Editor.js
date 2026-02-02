import React, { useRef, useCallback, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { setDocumentText, setFilename } from '../redux/actions.js';
import {
  getDocumentTextParameter,
  getDocumentUrl,
  getDocumentFile,
  getLineToFocus,
  getValidationResults,
  getFormatting,
} from '../redux/selectors.js';
import { useMonaco } from '../hooks/useMonaco.js';
import { useDocumentLoader } from '../hooks/useDocumentLoader.js';
import { useEditorDecorations } from '../hooks/useEditorDecorations.js';

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
  const classes = useStyles();
  const dispatch = useDispatch();
  
  // Selectors
  const validationResults = useSelector(getValidationResults);
  const focusLine = useSelector(getLineToFocus);
  const documentUrl = useSelector(getDocumentUrl);
  const documentFile = useSelector(getDocumentFile);
  const documentTextParameter = useSelector(getDocumentTextParameter);
  const formatting = useSelector(getFormatting);

  // Callback for editor content changes
  const handleContentChange = useCallback(
    (text) => {
      // If the editor is empty delete the filename section
      if (text.trim() === '') {
        dispatch(setFilename(null));
      }
      dispatch(setDocumentText(text));
    },
    [dispatch]
  );

  // Initialize Monaco
  const editorInstance = useMonaco(editorEl, handleContentChange);

  // Handle document loading (URL, File, Param)
  useDocumentLoader(
    editorInstance,
    documentUrl,
    documentFile,
    documentTextParameter,
    dispatch
  );

  // Handle visual decorations (errors/warnings)
  useEditorDecorations(editorInstance, validationResults, classes);

  // Handle line focusing (Navigation)
  useEffect(() => {
    if (!editorInstance || !focusLine) {
      return;
    }
    // Reveal line
    editorInstance.revealLineInCenter(focusLine.line);
    editorInstance.setPosition({ lineNumber: focusLine.line, column: focusLine.character });
    editorInstance.focus();
  }, [editorInstance, focusLine]);

  // Handle formatting
  useEffect(() => {
    if (!editorInstance || !formatting) {
      return;
    }

    const { tabSize } = formatting;
    const model = editorInstance.getModel();
    if (model) {
      model.updateOptions({ tabSize });
      editorInstance.getAction('editor.action.formatDocument').run();
    }
  }, [editorInstance, formatting]);

  return <div ref={editorEl} className={classes.editor}></div>;
};

export default Editor;