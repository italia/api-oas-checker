import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getValidationResultsInfo } from '../redux/selectors.js';
import { focusDocumentLine } from '../redux/actions.js';
import ValidationResultItem from './ValidationResultItem.js';

const useStyle = createUseStyles({
  enableScrollResults: { height: 'calc(100vh - 298px)', overflow: 'scroll' },
  headerResults: {
    composes: 'row py-3 no-gutters',
    borderLeft: '8px solid var(--white)',
    borderRight: '8px solid var(--white)',
  },
});

const ValidationResults = ({ validationResultsInfo, focusDocumentLine }) => {
  const classes = useStyle();

  if (validationResultsInfo === null) return null;

  return (
    <>
      <div className={classes.headerResults} data-testid="validation-results-header">
        <div className="col-2 text-center">Type</div>
        <div className="col-2 text-center">Line</div>
        <div className="col-8">Message</div>
      </div>
      <div className={classes.enableScrollResults}>
        {validationResultsInfo.map((r) => (
          <ValidationResultItem key={r.fingerprint} onResultClick={focusDocumentLine} resultInfo={r} />
        ))}
      </div>
    </>
  );
};

ValidationResults.propTypes = {
  validationResultsInfo: PropTypes.arrayOf(
    PropTypes.exact({
      character: PropTypes.number.isRequired,
      fingerprint: PropTypes.string.isRequired,
      line: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      severity: PropTypes.number.isRequired,
    })
  ),
  focusDocumentLine: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    validationResultsInfo: getValidationResultsInfo(state),
  }),
  {
    focusDocumentLine, // TODO: move in the child component???
  }
)(ValidationResults);
