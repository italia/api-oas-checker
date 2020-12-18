import React, { useCallback, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Document, Parsers } from '@stoplight/spectral';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import { getSpectral } from '../spectral.js';
import Menu from './Menu.js';
import Editor from './Editor.js';
import ValidationController from './ValidationController.js';
import ValidationSummary from './ValidationSummary.js';
import ValidationResults from './ValidationResults.js';
import { setValidationResults, setValidationInProgress } from '../redux/actions.js';
import { isMenuDisplayed } from '../redux/selectors.js';

const useStyles = createUseStyles({
  editorMarginHighlightSev1: {
    background: 'var(--danger)'
  },
  editorHighlightLine: {
    background: 'var(--primary)'
  }
})

const Main = ({ isMenuDisplayed, setValidationResults, setValidationInProgress }) => {
  const editor = useRef({});
  const decoration = useRef([]);
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
    'col-md-2': isMenuDisplayed,
    'd-none': !isMenuDisplayed,
  })

  const mainSection = cx({
    'col-md-6': isMenuDisplayed,
    'col-md-8': !isMenuDisplayed
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
        <ValidationController onValidate={handleValidation} />
        <ValidationSummary />
        <ValidationResults onResultClick={revealLine} />
      </section>
    </div>
  </main>
}

Main.propTypes = {
  isMenuDisplayed: PropTypes.bool.isRequired,
  setValidationResults: PropTypes.func.isRequired,
  setValidationInProgress: PropTypes.func.isRequired
}

export default connect(
  state => ({ isMenuDisplayed: isMenuDisplayed(state) }),
  { setValidationResults, setValidationInProgress })
(Main);