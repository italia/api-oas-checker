import React, { useState, useCallback } from 'react';
import { Editor } from './Editor.js';
import { Document, Parsers } from '@stoplight/spectral';
import { getSpectral } from '../spectral.js';
import * as monaco from 'monaco-editor';
import { ValidatorControllers } from './ValidatorControllers.js';
import { ValidatorResults } from './ValidatorResults.js';
import { createUseStyles } from 'react-jss';
import { ValidatorSummary } from './ValidatorSummary.js';
import { Menu } from './Menu.js';
import classNames from 'classnames';

const useStyles = createUseStyles({
  editorMarginHighlightSev1: {
    background: 'var(--danger)'
  },
  editorHighlightLine: {
    background: 'var(--primary)'
  }
})

export const Main = (props) => {
  const [spectralResult, setSpectralResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const editor = React.createRef = {};
  const decoration = React.createRef = [];
  decoration.current = [];
  const classes = useStyles();

  const validate = useCallback(
    async () => {
      setIsValidating(true);
      editor.current.deltaDecorations(decoration.current, []);
      setSpectralResult(null);
      const yaml = editor.current.getModel().getValue();
      const document = new Document(yaml, Parsers.Yaml);
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
      setSpectralResult(results);
      setIsValidating(false);
    }, []);

  const revealLine = useCallback(({ line, character }) => {
    editor.current.revealLineInCenter(line);
    editor.current.setPosition({ lineNumber: line, column: character });
    editor.current.focus();
  }, []);

  const sideSection = classNames({
    'col-md-2': !props.isExtended,
    'd-none': props.isExtended,
  })

  const mainSection = classNames({
    'col-md-6': !props.isExtended,
    'col-md-8': props.isExtended
  })

  return <main>
          <div className="container-fluid p-0">
            <div className="row no-gutters">
              <div className={sideSection}>
                <Menu />
              </div>
              <div className={mainSection}>
                <Editor ref={editor} onChange={validate}/>
              </div>
              <div className="col-md-4">
                <ValidatorControllers onValidate={validate} isValidating={isValidating}/>
                <ValidatorSummary results={spectralResult} />
                <ValidatorResults isValidating={isValidating} results={spectralResult} onResultClick={revealLine}/>
              </div>
            </div>
          </div>
        </main>
}