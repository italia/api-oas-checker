import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getValidationResults } from '../redux/selectors.js';
import { focusDocumentLine } from '../redux/actions.js';
import ValidationResultItem from './ValidationResultItem.js';
import { getValidationResultsPropTypes } from '../utils.js';

const useStyle = createUseStyles({
  enableScrollResults: { height: 'calc(100vh - 298px)', overflow: 'scroll' },
  headerResults: {
    composes: 'row py-3 no-gutters',
    borderLeft: '8px solid var(--white)',
    borderRight: '8px solid var(--white)',
  },
});

const ValidationResults = ({ validationResults, focusDocumentLine }) => {
  const classes = useStyle();

  if (validationResults === null) return null;

  const resultsInfo = validationResults.map((r) => ({
    fingerprint: r.fingerprint,
    severity: r.severity,
    line: r.range.start.line,
    character: r.range.start.character,
    message: r.message,
  }));

  return (
    <>
      <div className={classes.headerResults} data-testid="validation-results-header">
        <div className="col-1 text-center">Type</div>
        <div className="col-1 text-center">Line</div>
        <div className="col-10">Message</div>
      </div>
      <div className={classes.enableScrollResults}>
        {resultsInfo.map((r) => (
          <ValidationResultItem key={r.fingerprint} onResultClick={focusDocumentLine} resultInfo={r} />
        ))}
      </div>
    </>
  );
};

ValidationResults.propTypes = {
  validationResults: getValidationResultsPropTypes(),
  focusDocumentLine: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    validationResults: getValidationResults(state),
  }),
  {
    focusDocumentLine, // TODO: move in the child component???
  }
)(ValidationResults);
