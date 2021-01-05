import SpectralWorker from 'worker-loader!../spectral/spectral_worker.js';

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Button, Icon, Label, Input, FormGroup } from 'design-react-kit';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDocumentText, isValidationInProgress, getRuleset } from '../redux/selectors.js';
import { resetValidationResults, setValidationInProgress, setValidationResults } from '../redux/actions.js';
import { RULESET_BEST_PRACTICES, RULESET_ITALIAN, RULESET_ITALIAN_PLUS_SECURITY, RULESET_SECURITY } from '../utils.js';

const useStyles = createUseStyles({
  '@keyframes rotation': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  validatorIcon: {
    composes: 'ml-3',
    fontSize: '1.5rem',
    animation: (isValidationInProgress) => isValidationInProgress && '$rotation 2s infinite',
  },
  formGroupButtonValidate: {
    composes: 'mx-3',
    flexGrow: (isValidationInProgress) => isValidationInProgress && 1,
  },
});

const spectralWorker = new SpectralWorker();

const ValidationController = ({
  documentText,
  isValidationInProgress,
  ruleset,
  resetValidationResults,
  setValidationResults,
  setValidationInProgress,
}) => {
  const previousDocumentText = useRef();
  const classes = useStyles(isValidationInProgress);

  const handleValidation = useCallback(() => {
    setValidationInProgress();
    spectralWorker.postMessage({ documentText, ruleset: `${location.href}${ruleset}` });
    spectralWorker.onmessage = (event) => {
      if (event.data.error) {
        console.error(event.data.error);
        alert(`Error during validation
        
${event.data.error}`);
        resetValidationResults();
        return;
      }
      setValidationResults(event.data);
    };
  }, [documentText, resetValidationResults, setValidationInProgress, setValidationResults, ruleset]);

  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (!autoRefresh || previousDocumentText.current === documentText) return;
    handleValidation();
  }, [documentText, autoRefresh, handleValidation]);

  // Get previous text prop to handle correctly auto-refresh
  useEffect(() => {
    previousDocumentText.current = documentText;
  });

  const handleAutoRefreshToogle = useCallback(() => {
    setAutoRefresh(!autoRefresh);
  }, [autoRefresh, setAutoRefresh]);

  return (
    <div className="py-3 d-flex align-items-center bg-white">
      <div className={classes.formGroupButtonValidate} tag="div">
        <Button
          data-testid="validation-button"
          className="w-100 py-2 px-3"
          color="primary"
          icon
          tag="button"
          onClick={isValidationInProgress ? Function.prototype : handleValidation}
        >
          {isValidationInProgress ? 'Please wait...' : 'Validate'}
          <Icon className={classes.validatorIcon} color="white" icon="it-refresh" />
        </Button>
      </div>

      {!isValidationInProgress && (
        <FormGroup check className="mx-3 my-0" tag="div">
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
  ruleset: PropTypes.oneOf([RULESET_ITALIAN, RULESET_BEST_PRACTICES, RULESET_SECURITY, RULESET_ITALIAN_PLUS_SECURITY]),
  resetValidationResults: PropTypes.func.isRequired,
  setValidationInProgress: PropTypes.func.isRequired,
  setValidationResults: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    documentText: getDocumentText(state),
    isValidationInProgress: isValidationInProgress(state),
    ruleset: getRuleset(state),
  }),
  {
    resetValidationResults,
    setValidationResults,
    setValidationInProgress,
  }
)(ValidationController);
