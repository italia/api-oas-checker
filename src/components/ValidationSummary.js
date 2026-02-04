import React from 'react';
import PropTypes from 'prop-types';
import {Badge, Button, Icon} from 'design-react-kit';
import {useSelector} from 'react-redux';
import {createUseStyles} from 'react-jss';
import {getOnlyErrors, getValidationResults} from '../redux/selectors.js';
import {ERROR, HINT, INFO, WARNING} from '../utils.mjs';
import {getValidationResultType} from '../spectral/spectral_utils.js';

const useStyles = createUseStyles({
  container: {
    composes: 'px-4 py-3 bg-white border-bottom',
  },
  error: {
    backgroundColor: (summary) => (summary.errors > 0 ? 'var(--danger) !important' : 'var(--success-light) !important'),
    color: (summary) => (summary.errors > 0 ? 'var(--white) !important' : 'var(--text-dark) !important'),
  },
  warning: {
    backgroundColor: (summary) => (summary.warnings > 0 ? 'var(--warning) !important' : 'var(--success-light) !important'),
    color: (summary) => (summary.warnings > 0 ? 'var(--text-dark) !important' : 'var(--text-dark) !important'),
  },
  info: {
    backgroundColor: (summary) => (summary.infos > 0 ? 'var(--info) !important' : 'var(--success-light) !important'),
    color: (summary) => (summary.infos > 0 ? 'var(--white) !important' : 'var(--text-dark) !important'),
  },
  hint: {
    backgroundColor: (summary) => (summary.hints > 0 ? 'var(--secondary) !important' : 'var(--success-light) !important'),
    color: (summary) => (summary.hints > 0 ? 'var(--white) !important' : 'var(--text-dark) !important'),
  },
});

const getErrorLabel = (summary) => (summary.errors > 0 ? `${summary.errors} errors` : 'No errors');
const getWarningLabel = (summary) => (summary.warnings > 0 ? `${summary.warnings} warnings` : 'No warnings');
const getInfoLabel = (summary) => (summary.infos > 0 ? `${summary.infos} infos` : 'No infos');
const getHintLabel = (summary) => (summary.hints > 0 ? `${summary.hints} hints` : 'No hints');

export const ValidationSummary = ({ onSeeDetails }) => {
  const validationResults = useSelector((state) => getValidationResults(state));
  const onlyErrors = useSelector((state) => getOnlyErrors(state));
  const summary = {
    errors: validationResults?.filter((r) => getValidationResultType(r.severity) === ERROR).length,
    warnings: validationResults?.filter((r) => getValidationResultType(r.severity) === WARNING).length,
    infos: validationResults?.filter((r) => getValidationResultType(r.severity) === INFO).length,
    hints: validationResults?.filter((r) => getValidationResultType(r.severity) === HINT).length,
  };
  const classes = useStyles(summary);

  return (
    validationResults && (
      <div className={classes.container}>
        <p className="mb-3 small font-weight-bold text-muted">Step 5. Summary</p>
        <p className="small mb-2">
          A summary of the validation results categorized by severity. Click "Review" to see the detailed list of issues.
        </p>
        <div className="d-flex align-items-center">
          <h4 className="pr-3 mb-0 d-flex align-items-center">
            <Badge data-testid="errors-badge" className={classes.error} pill={false} tag="span">
              {getErrorLabel(summary)}
            </Badge>
          </h4>
          {!onlyErrors && (
            <>
              <h4 className="pr-3 mb-0 d-flex align-items-center">
                <Badge data-testid="warnings-badge" className={classes.warning} pill={false} tag="span">
                  {getWarningLabel(summary)}
                </Badge>
              </h4>
              <h4 className="pr-3 mb-0 d-flex align-items-center">
                <Badge data-testid="infos-badge" className={classes.info} pill={false} tag="span">
                  {getInfoLabel(summary)}
                </Badge>
              </h4>
              <h4 className="mb-0 d-flex align-items-center mr-auto">
                <Badge data-testid="hints-badge" className={classes.hint} pill={false} tag="span">
                  {getHintLabel(summary)}
                </Badge>
              </h4>
            </>
          )}
          {validationResults.length > 0 && (
            <Button
              color="primary"
              icon
              tag="button"
              onClick={onSeeDetails}
              className="ml-3 py-2 px-3 d-flex align-items-center"
            >
              Review
              <Icon icon="it-arrow-right" color="white" className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    )
  );
};

ValidationSummary.propTypes = {
  onSeeDetails: PropTypes.func.isRequired,
};