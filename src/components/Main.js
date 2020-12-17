import React, { useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { connect } from 'react-redux';
import { createUseStyles } from 'react-jss';
import { Editor } from './Editor.js';
import { Document, Parsers } from '@stoplight/spectral';
import { getSpectral } from '../spectral.js';
import ValidatorControllers from './ValidatorControllers.js';
import ValidatorResults from './ValidatorResults.js';
import ValidatorSummary from './ValidatorSummary.js';
import Menu from './Menu.js';
import { setValidationResults, setValidationInProgress } from '../redux/actions.js';
import cx from 'classnames';

const useStyles = createUseStyles({
  editorMarginHighlightSev1: {
    background: 'var(--danger)'
  },
  editorHighlightLine: {
    background: 'var(--primary)'
  }
})

const Main = ({ showMenu, setValidationResults, setValidationInProgress }) => {
  const editor = React.createRef = {};
  const decoration = React.createRef = [];
  decoration.current = [];
  const classes = useStyles();

  const handleValidation = useCallback(
    async () => {
      setValidationInProgress(true);
      editor.current.deltaDecorations(decoration.current, []);
      const text = editor.current.getModel().getValue();
      const document = new Document(text, Parsers.Yaml);
      const spectral = await getSpectral();
      const results = await spectral.run(document);
      const newDecorations = [];
      for (const result of results) {
        newDecorations.push({
          range: new monaco.Range(result.range.start.line,1, result.range.end.line,1),
          options: {
            isWholeLine: true,
            className: classes.editorHighlightLine,
            glyphMarginClassName: classes.editorMarginHighlightSev1
          }
        });
      }
      decoration.current = editor.current.deltaDecorations([], newDecorations);
      setValidationResults(results);
      setValidationInProgress(false);
    }, []);

  const revealLine = useCallback(({ line, character }) => {
    editor.current.revealLineInCenter(line);
    editor.current.setPosition({ lineNumber: line, column: character });
    editor.current.focus();
  }, []);

  const sideSection = cx({
    'col-md-2': showMenu,
    'd-none': !showMenu,
  })

  const mainSection = cx({
    'col-md-6': showMenu,
    'col-md-8': !showMenu
  })

  return <main className="container-fluid p-0">
    <div className="row no-gutters">
      <aside className={sideSection}>
        <Menu />
      </aside>
      <section className={mainSection}>
        <Editor ref={editor} onChange={handleValidation}/>
      </section>
      <section className="col-md-4">
        <ValidatorControllers onValidate={handleValidation} />
        <ValidatorSummary />
        <ValidatorResults onResultClick={revealLine} />
      </section>
    </div>
  </main>
}

export default connect(
  state => ({
    showMenu: state.menuState.showMenu
  }),
  { setValidationResults, setValidationInProgress })
(Main);