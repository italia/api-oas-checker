import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { Document, Parsers } from '@stoplight/spectral';
import { Button, Icon, Label, Input, FormGroup } from 'design-react-kit';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDocumentText, isValidationInProgress } from '../redux/selectors.js';
import { getSpectral } from '../spectral.js';
import { setValidationInProgress, setValidationResults } from '../redux/actions.js';

const useStyles = createUseStyles({
  validatorIconSize: {
    fontSize: '1.5rem',
  },
});

const ValidationController = ({
  isValidationInProgress,
  documentText,
  setValidationResults,
  setValidationInProgress,
}) => {
  const classes = useStyles();
  const formGroupButtonValidateCx = cx(
    {
      'flex-grow-1': isValidationInProgress,
    },
    'm-3'
  );

  const handleValidation = useCallback(async () => {
    setValidationInProgress(true);
    const document = new Document(documentText, Parsers.Yaml);
    const spectral = await getSpectral();
    const results = await spectral.run(document);
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
    setValidationResults(results);
    setValidationInProgress(false);
  }, [documentText]);

  const onValidationButtonClick = isValidationInProgress ? Function.prototype : handleValidation;

  return (
    <div className="d-flex align-items-center">
      <FormGroup className={formGroupButtonValidateCx} tag="div">
        <Button
          data-testid="validation-button"
          className="w-100 py-2 px-3"
          color="primary"
          icon
          tag="button"
          onClick={onValidationButtonClick}
        >
          {isValidationInProgress ? 'Please wait...' : 'Validate'}
          <Icon className={`ml-3 ${classes.validatorIconSize}`} color="white" icon="it-refresh" />
        </Button>
      </FormGroup>

      {!isValidationInProgress && (
        <FormGroup check className="m-3" tag="div">
          <div data-testid="auto-refresh" className="toggles">
            <Label className="m-0 font-weight-light" check>
              Auto-refresh
              <Input type="checkbox" defaultChecked />
              <span className="lever" />
            </Label>
          </div>
        </FormGroup>
      )}
    </div>
  );
};

ValidationController.propTypes = {
  // isValidationInProgress: PropTypes.bool.isRequired,
};

export default connect(
  (state) => ({
    isValidationInProgress: isValidationInProgress(state),
    documentText: getDocumentText(state),
  }),
  {
    setValidationResults,
    setValidationInProgress,
  }
)(ValidationController);
