import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import * as monaco from 'monaco-editor';
import debounce from 'lodash.debounce';
import { createUseStyles } from 'react-jss';
import PropTypes from 'prop-types';

const useStyles = createUseStyles({
  editor: {
    height: 'calc(100vh - 80px)',
    overflow: 'auto',
  },
});

const Editor = React.forwardRef(({ onChange }, editorRef) => {
  const editorEl = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    const initMonaco = async () => {
      const { data: yaml } = await axios.get('example.yaml');
      editorRef.current = monaco.editor.create(editorEl.current, {
        value: [yaml].join('\n'),
        language: 'yaml',
        glyphMargin: true,
        theme: 'vs-dark',
        automaticLayout: true,
      });
      editorRef.current.onDidChangeModelContent(debounce(onChange, 1000));
      editorRef.current.changeViewZones((accessor) => {
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

  return (
    <>
      <div ref={editorEl} className={classes.editor}></div>
    </>
  );
});

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
};

Editor.displayName = 'Editor';

export default Editor;

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
