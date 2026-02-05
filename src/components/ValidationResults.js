import React from 'react';
import {createUseStyles} from 'react-jss';
import {useSelector} from 'react-redux';
import {Icon} from 'design-react-kit';
import {getValidationResults} from '../redux/selectors.js';
import {getValidationResultKey} from '../spectral/spectral_utils.js';
import {ValidationResultItem} from './ValidationResultItem.js';

const useStyle = createUseStyles({
  enableScrollResults: { height: 'calc(100vh - 120px)', overflow: 'scroll' },
  headerResults: {
    composes: 'row py-3 no-gutters border-bottom',
    backgroundColor: 'var(--white)',
    borderLeft: '8px solid var(--white)',
    borderRight: '8px solid var(--white)',
  },
  successMessage: {
    composes: 'd-flex align-items-center justify-content-center p-4',
    fontSize: '1.2rem',
    color: 'var(--success)',
    height: '100%',
    backgroundColor: 'var(--white)',
  },
});

export const ValidationResults = () => {
  const validationResults = useSelector((state) => getValidationResults(state));
  const classes = useStyle();

  if (validationResults === null) {
    return null;
  }

  if (validationResults.length === 0) {
    return (
      <div className={classes.successMessage}>
        <Icon icon="it-check-circle" color="success" size="lg" className="mr-3" />
        <span className="font-weight-bold">The API specification is valid. No issues found.</span>
      </div>
    );
  }

  return (
    <>
      <div className={classes.headerResults} data-testid="validation-results-header">
        <div className="col-1 text-center">Type</div>
        <div className="col-1 text-center">Line</div>
        <div className="col-10 px-4">Message</div>
      </div>
      <div className={classes.enableScrollResults}>
        {validationResults.map((r) => (
          <ValidationResultItem key={getValidationResultKey(r)} resultItem={r} />
        ))}
      </div>
    </>
  );
};
