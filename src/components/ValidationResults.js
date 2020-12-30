import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import { getValidationResults } from '../redux/selectors.js';
import ValidationResultItem from './ValidationResultItem.js';
import { getValidationResultsPropTypes, getValidationResultKey } from '../spectral/spectral_utils.js';

const useStyle = createUseStyles({
  enableScrollResults: { height: 'calc(100vh - 376px)', overflow: 'scroll' },
  headerResults: {
    composes: 'row py-3 no-gutters',
    borderLeft: '8px solid var(--white)',
    borderRight: '8px solid var(--white)',
  },
});

const ValidationResults = ({ validationResults }) => {
  const classes = useStyle();

  if (validationResults === null || validationResults.length === 0) return null;

  return (
    <>
      <div className={classes.headerResults} data-testid="validation-results-header">
        <div className="col-1 text-center">Type</div>
        <div className="col-2 col-xxl-1 text-center">Line</div>
        <div className="col-9 col-xxl-10">Message</div>
      </div>
      <div className={classes.enableScrollResults}>
        {validationResults.map((r) => (
          <ValidationResultItem key={getValidationResultKey(r)} resultItem={r} />
        ))}
      </div>
    </>
  );
};

ValidationResults.propTypes = {
  validationResults: getValidationResultsPropTypes(),
};

export default connect((state) => ({
  validationResults: getValidationResults(state),
}))(ValidationResults);
