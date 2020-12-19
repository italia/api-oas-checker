import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import * as monaco from 'monaco-editor';
import debounce from 'lodash.debounce';
import { createUseStyles } from 'react-jss';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setDocumentText } from '../redux/actions.js';

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

const Editor = ({ results, setDocumentText, focusDocumentLine }) => {
  const editorEl = useRef(null);
  const editor = useRef({});
  const decoration = useRef([]);
  decoration.current = [];
  const classes = useStyles();

  useEffect(() => {
    const initMonaco = async () => {
      const { data: text } = await axios.get('example.yaml');
      setDocumentText(text);
      editor.current = monaco.editor.create(editorEl.current, {
        value: [text].join('\n'),
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
      editor.current.changeViewZones((accessor) => {
        accessor.addZone({
          afterLineNumber: 0,
          heightInPx: 20,
          domNode: document.createElement('span'),
        });
      });
    };
    initMonaco();
    // return () => editorRef.current.getModels().forEach(model => model.dispose());
  }, []);

  useEffect(() => {
    // TODO: here there is a performance issue
    const highlightIssues = () => {
      if (results) {
        // editor.current.deltaDecorations(decoration.current, []);
        // const newDecorations = [];
        // for (const result of results) {
        //   newDecorations.push({
        //     range: new monaco.Range(result.range.start.line, 1, result.range.end.line, 1),
        //     options: {
        //       isWholeLine: true,
        //       className: classes.editorHighlightLine,
        //       glyphMarginClassName: classes.editorMarginHighlightSev1,
        //     },
        //   });
        // }
        // decoration.current = editor.current.deltaDecorations([], newDecorations);
      }
    };
    highlightIssues();
  }, [results]);

  useEffect(() => {
    const revealLine = () => {
      if (focusDocumentLine) {
        editor.current.revealLineInCenter(focusDocumentLine);
        editor.current.setPosition({ lineNumber: focusDocumentLine, column: 0 });
        editor.current.focus();
      }
    };
    revealLine();
  }, [focusDocumentLine]);

  return <div ref={editorEl} className={classes.editor}></div>;
};

// Editor.propTypes = {
//   onChange: PropTypes.func.isRequired,
// };

export default connect(
  (state) => ({
    results: state.validationState.results,
    focusDocumentLine: state.documentState.focusDocumentLine,
  }),
  {
    setDocumentText,
  }
)(Editor);

// const Editor = React.forwardRef((props, editorRef) => {
//   const editorEl = useRef(null);
//   const classes = useStyles();
//
//   useEffect(() => {
//     const initMonaco = async () => {
//       const { data: yaml } = await axios.get('example.yaml');
//       editorRef.current = monaco.editor.create(editorEl.current, {
//         value: [yaml].join('\n'),
//         language: 'yaml',
//         glyphMargin: true,
//         theme: 'vs-dark',
//         automaticLayout: true,
//       });
//       editorRef.current.onDidChangeModelContent(debounce((e) => props.onChange(), 1000));
//       editorRef.current.changeViewZones((accessor) => {
//         accessor.addZone({
//           afterLineNumber: 0,
//           heightInPx: 20,
//           domNode: document.createElement('span'),
//         });
//       });
//     };
//     initMonaco();
//     // return () => editorRef.current.getModels().forEach(model => model.dispose());
//   }, []);
//
//   return (
//     <>
//       <div ref={editorEl} className={classes.editor}></div>
//     </>
//   );
// });
//
// export default Editor;
