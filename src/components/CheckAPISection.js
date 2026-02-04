import SpectralWorker from 'worker-loader!../spectral/spectral_worker.js';
import React, {useCallback, useEffect, useRef} from 'react';
import {Button, Icon} from 'design-react-kit';
import {createUseStyles} from 'react-jss';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAutoRefresh,
  getDocumentText,
  getOnlyErrors,
  getRuleset,
  isValidationInProgress
} from '../redux/selectors.js';
import {resetValidationResults, setValidationInProgress, setValidationResults} from '../redux/actions.js';
import store from '../redux/store.js';

const useStyles = createUseStyles({
  '@keyframes rotation': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  validatorIcon: {
    composes: 'ml-2',
    fontSize: '1.2rem',
    animation: (validationInProgress) => validationInProgress && '$rotation 2s infinite',
  },
  container: {
    composes: 'px-4 py-3 bg-white border-bottom',
  },
});

const spectralWorker = new SpectralWorker();

/**
 * Component for Step 4: Triggering the API validation.
 * Handles validation logic and auto-refresh functionality.
 */
export const CheckAPISection = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const documentText = useSelector((state) => getDocumentText(state));
  const ruleset = useSelector((state) => getRuleset(state));
  const onlyErrors = useSelector((state) => getOnlyErrors(state));
  const autoRefresh = useSelector((state) => getAutoRefresh(state));
  const dispatch = useDispatch();
  
  const previousDocumentText = useRef();
  const previousRuleset = useRef();
  const classes = useStyles(validationInProgress);

  const handleValidation = useCallback(() => {
    if (window.editor && window.editor.flushChanges) {
      window.editor.flushChanges();
    }
    const latestDocumentText = getDocumentText(store.getState());
    dispatch(setValidationInProgress());
    spectralWorker.postMessage({
      documentText: latestDocumentText,
      ruleset: `${location.origin}${location.pathname}${ruleset}`,
      onlyErrors,
    });
    spectralWorker.onmessage = (event) => {
      if (event.data.error !== undefined) {
        console.error('Validation error:', event.data.error);
        alert(`Error during validation ${event.data.error}`);
        dispatch(resetValidationResults());
        return;
      }
      dispatch(setValidationResults(event.data));
    };
  }, [ruleset, onlyErrors, dispatch]);

  const needRevalidation = useCallback(
    () => previousDocumentText.current !== documentText || previousRuleset.current !== ruleset,
    [documentText, ruleset]
  );

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }
    if (needRevalidation()) {
      handleValidation();
    }
  }, [autoRefresh, handleValidation, needRevalidation]);

  useEffect(() => {
    previousDocumentText.current = documentText;
    previousRuleset.current = ruleset;
  });

  return (
    <div className={classes.container}>
      <p className="mb-3 small font-weight-bold text-muted">Step 4. Run Validation</p>
      <Button
        data-testid="validation-button"
        className="py-2 px-3 w-100 justify-content-center d-flex align-items-center"
        color="primary"
        icon
        disabled={documentText === null || validationInProgress}
        tag="button"
        onClick={handleValidation}
      >
        <span>{validationInProgress ? 'Validating...' : 'Check API'}</span>
        <Icon className={classes.validatorIcon} color="white" icon="it-refresh" />
      </Button>
    </div>
  );
};