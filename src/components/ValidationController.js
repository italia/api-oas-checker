import React, { useCallback, useState, useEffect, useRef } from 'react';
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
  const previousDocumentText = useRef();
  const formGroupButtonValidateCx = cx(
    {
      'flex-grow-1': isValidationInProgress,
    },
    'm-3'
  );
  const classes = useStyles();

  const handleValidation = useCallback(async () => {
    setValidationInProgress();
    const document = new Document(documentText, Parsers.Yaml);
    const spectral = await getSpectral();
    const results = await spectral.run(document);
    setValidationResults(results);
  }, [documentText, setValidationInProgress, setValidationResults]);

  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (!autoRefresh || previousDocumentText.current === documentText) return;

    const triggerValidation = async () => {
      await handleValidation();
    };
    triggerValidation();
  }, [documentText, autoRefresh, handleValidation]);

  // Get previous text prop to handle correctly auto-refresh
  useEffect(() => {
    previousDocumentText.current = documentText;
  });

  const handleAutoRefreshToogle = useCallback(() => {
    setAutoRefresh(!autoRefresh);
  }, [autoRefresh, setAutoRefresh]);

  return (
    <div className="d-flex align-items-center">
      <FormGroup className={formGroupButtonValidateCx} tag="div">
        <Button
          data-testid="validation-button"
          className="w-100 py-2 px-3"
          color="primary"
          icon
          tag="button"
          onClick={isValidationInProgress ? Function.prototype : handleValidation}
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
              <Input type="checkbox" checked={autoRefresh} onChange={handleAutoRefreshToogle} />
              <span className="lever" />
            </Label>
          </div>
        </FormGroup>
      )}
    </div>
  );
};

ValidationController.propTypes = {
  isValidationInProgress: PropTypes.bool.isRequired,
  documentText: PropTypes.string,
  setValidationInProgress: PropTypes.func.isRequired,
  setValidationResults: PropTypes.func.isRequired,
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
