import React, { useCallback, useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import { Document, Parsers } from '@stoplight/spectral';
import { Button, Icon, Label, Input, FormGroup } from 'design-react-kit';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDocumentText, isValidationInProgress, getRuleset } from '../redux/selectors.js';
import { getSpectralEngine } from '../spectral.js';
import { setValidationInProgress, setValidationResults } from '../redux/actions.js';
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
});

const ValidationController = ({
  documentText,
  isValidationInProgress,
  ruleset,
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
  const classes = useStyles(isValidationInProgress);

  const handleValidation = useCallback(async () => {
    setValidationInProgress();
    const document = new Document(documentText, Parsers.Yaml);
    const spectral = await getSpectralEngine(ruleset);

    // We need a timeout otherwise spectral will consume all the available cpu and the ui rendering will be blocked
    // TODO: we need a web worker
    setTimeout(async () => {
      const results = await spectral.run(document);
      setValidationResults(results);
    }, 100);
  }, [documentText, setValidationInProgress, setValidationResults, ruleset]);

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
          <Icon className={classes.validatorIcon} color="white" icon="it-refresh" />
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
  ruleset: PropTypes.oneOf([RULESET_ITALIAN, RULESET_BEST_PRACTICES, RULESET_SECURITY, RULESET_ITALIAN_PLUS_SECURITY]),
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
    setValidationResults,
    setValidationInProgress,
  }
)(ValidationController);
