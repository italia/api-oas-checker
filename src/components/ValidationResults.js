import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getValidationResultsInfo } from '../redux/selectors.js';
import { focusDocumentLine } from '../redux/actions.js';

const useStyle = createUseStyles({
  breakWords: { wordBreak: 'break-all' },
  enableScrollResults: { height: 'calc(100vh - 298px)', overflow: 'scroll' },
});

const ValidationResults = ({ validationResultsInfo, focusDocumentLine }) => {
  if (validationResultsInfo.length === 0) return null;

  const classes = useStyle();

  return (
    <>
      <div className="row py-3" data-testid="validation-results-header">
        <div className="col-2 text-center">Type</div>
        <div className="col-2 text-center">Line</div>
        <div className="col-8">Message</div>
      </div>
      <div className={classes.enableScrollResults}>
        {validationResultsInfo.map((r) => (
          <div
            data-testid="validation-result-entry"
            className="row py-3"
            role="button"
            key={r.fingerprint}
            onClick={() => focusDocumentLine(r.line)}
          >
            <div className="col-2 text-center">{r.severity}</div>
            <div className="col-2 text-center">{r.line}</div>
            <div className={`col-8 ${classes.breakWords}`}>{r.message}</div>
          </div>
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
};

export default connect(
  (state) => ({
    validationResultsInfo: getValidationResultsInfo(state),
  }),
  {
    focusDocumentLine,
  }
)(ValidationResults);
