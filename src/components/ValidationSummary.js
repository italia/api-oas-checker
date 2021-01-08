import React from 'react';
import { Badge } from 'design-react-kit';
import { connect } from 'react-redux';
import { getValidationResults } from '../redux/selectors.js';
import { createUseStyles } from 'react-jss';
import { ERROR, WARNING } from '../utils.mjs';
import { getValidationResultsPropTypes, getValidationResultType } from '../spectral/spectral_utils.js';

const useStyles = createUseStyles({
  error: {
    backgroundColor: (summary) => (summary.errors > 0 ? 'var(--danger)' : 'var(--success-light)'),
    color: (summary) => (summary.errors > 0 ? 'var(--white)' : 'var(--text-dark)'),
  },
  warning: {
    backgroundColor: (summary) => (summary.warnings > 0 ? 'var(--warning)' : 'var(--success-light)'),
    color: 'var(--text-dark)',
  },
});

const getErrorLabel = (summary) => (summary.errors > 0 ? `${summary.errors} errors` : 'No errors');

const getWarningLabel = (summary) => (summary.warnings > 0 ? `${summary.warnings} warnings` : 'No warnings');

const ValidationSummary = ({ validationResults }) => {
  const summary = {
    errors: validationResults?.filter((r) => getValidationResultType(r.severity) === ERROR).length,
    warnings: validationResults?.filter((r) => getValidationResultType(r.severity) === WARNING).length,
  };
  const classes = useStyles(summary);

  return (
    validationResults && (
      <div className="d-flex p-3 bg-primary">
        <h4 className="pr-3">
          <Badge data-testid="errors-badge" className={classes.error} pill={false} tag="span">
            {getErrorLabel(summary)}
          </Badge>
        </h4>
        <h4>
          <Badge data-testid="warnings-badge" className={classes.warning} pill={false} tag="span">
            {getWarningLabel(summary)}
          </Badge>
        </h4>
      </div>
    )
  );
};

ValidationSummary.propTypes = {
  validationResults: getValidationResultsPropTypes(),
};

export default connect((state) => ({
  validationResults: getValidationResults(state),
}))(ValidationSummary);
