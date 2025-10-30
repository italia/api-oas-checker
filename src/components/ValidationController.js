import SpectralWorker from 'worker-loader!../spectral/spectral_worker.js';

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Button, Icon, Label, Input, FormGroup } from 'design-react-kit';
import { createUseStyles } from 'react-jss';
import { useSelector, useDispatch } from 'react-redux';
import { getDocumentText, isValidationInProgress, getRuleset } from '../redux/selectors.js';
import { resetValidationResults, setValidationInProgress, setValidationResults } from '../redux/actions.js';

const useStyles = createUseStyles({
  '@keyframes rotation': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  validatorIcon: {
    composes: 'ml-3',
    fontSize: '1.5rem',
    animation: (validationInProgress) => validationInProgress && '$rotation 2s infinite',
  },
  formGroupButtonValidate: {
    composes: 'mx-3',
    flexGrow: (validationInProgress) => validationInProgress && 1,
  },
});

const spectralWorker = new SpectralWorker();

export const ValidationController = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const documentText = useSelector((state) => getDocumentText(state));
  const ruleset = useSelector((state) => getRuleset(state));
  const dispatch = useDispatch();
  const previousDocumentText = useRef();
  const previousRuleset = useRef();
  const needRevalidation = useCallback(
    () => previousDocumentText.current !== documentText || previousRuleset.current !== ruleset,
    [documentText, ruleset]
  );
  const classes = useStyles(validationInProgress);

  const [onlyErrors, setOnlyErrors] = useState(false);
  const handleOnlyErrorsToggle = useCallback(() => {
    setOnlyErrors((prevOnlyErrors) => !prevOnlyErrors);
  }, []);

  const handleValidation = useCallback(() => {
    dispatch(setValidationInProgress());
    spectralWorker.postMessage({
      documentText,
      ruleset: `${location.origin}${location.pathname}${ruleset}`,
      onlyErrors,
    });
    spectralWorker.onmessage = (event) => {
      if (event.data.error) {
        console.error(event.data.error);
        alert(`Error during validation
        
${event.data.error}`);
        dispatch(resetValidationResults());
        return;
      }
      dispatch(setValidationResults(event.data));
    };
  }, [documentText, ruleset, onlyErrors, dispatch]);

  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }
    if (needRevalidation()) {
      handleValidation();
    }
  }, [autoRefresh, handleValidation, needRevalidation]);

  // Get previous text prop to handle correctly auto-refresh
  useEffect(() => {
    previousDocumentText.current = documentText;
    previousRuleset.current = ruleset;
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
          disabled={documentText === null}
          tag="button"
          onClick={validationInProgress ? Function.prototype : handleValidation}
        >
          {validationInProgress ? 'Please wait...' : 'Check'}
          <Icon className={classes.validatorIcon} color="white" icon="it-refresh" />
        </Button>
      </div>

      {!validationInProgress && (
        <FormGroup check className="mx-3 my-0" tag="div">
          <div data-testid="auto-refresh" className="toggles">
            <Label className="m-0 font-weight-light" check>
              Auto-refresh
              <Input type="checkbox" checked={autoRefresh} onChange={handleAutoRefreshToogle} />
              <span className="lever" />
            </Label>
          </div>
          <div data-testid="only-errors" className="toggles">
            <Label className="m-0 font-weight-light" check>
              Only-errors
              <Input type="checkbox" checked={onlyErrors} onChange={handleOnlyErrorsToggle} />
              <span className="lever" />
            </Label>
          </div>
        </FormGroup>
      )}
    </div>
  );
};
