import React from 'react';
import { Badge } from 'design-react-kit';
import { connect } from 'react-redux';
import { getValidationResults } from '../redux/selectors.js';
import { createUseStyles } from 'react-jss';
import { ERROR, getValidationResultType, getValidationResultsPropTypes, WARNING } from '../utils.js';
const useStyles = createUseStyles({
  error: {
    backgroundColor: 'var(--danger)',
  },
  warning: {
    backgroundColor: 'var(--warning)',
    color: 'var(--warning-text-dark)',
  },
});

const ValidationSummary = ({ validationResults }) => {
  const classes = useStyles();

  if (validationResults === null) return null;

  const summary = {
    errors: validationResults.filter((r) => getValidationResultType(r.severity) === ERROR).length,
    warnings: validationResults.filter((r) => getValidationResultType(r.severity) === WARNING).length,
  };

  return (
    <div className="d-flex p-3 bg-primary">
      <h4 className="pr-3">
        <Badge data-testid="errors-badge" className={classes.error} pill={false} tag="span">
          {summary.errors} errors
        </Badge>
      </h4>
      <h4>
        <Badge data-testid="warnings-badge" className={classes.warning} pill={false} tag="span">
          {summary.warnings} warnings
        </Badge>
      </h4>
    </div>
  );
};

ValidationSummary.propTypes = {
  validationResults: getValidationResultsPropTypes(),
};

export default connect((state) => ({
  validationResults: getValidationResults(state),
}))(ValidationSummary);
