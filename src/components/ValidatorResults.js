import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import { getValidationResultsInfo } from '../redux/selectors.js';

const useStyle = createUseStyles({
  breakWords: {
    wordBreak: 'break-all'
  },
  enableScrollResults: {
    height: 'calc(100vh - 266px)',
    overflow: 'scroll'
  }
});

// TODO: check if results can be merged with in progress to avoid double rendering
const ValidatorResults = ({ validationInProgress, validationResultsInfo, onResultClick }) => {
  if (validationInProgress || validationResultsInfo.length === 0) return null;

  const classes = useStyle();

  return <><div className="row py-3">
    <div className="col-2 text-center">
      Type
    </div>
    <div className="col-2 text-center">
      Line
    </div>
    <div className="col-8">
      Message
    </div>
  </div>
    <div className={classes.enableScrollResults}>
      {validationResultsInfo.map(r =>
        <div className="row py-3" role="button" key={r.fingerprint} onClick={() => onResultClick({ line: r.line, character: r.character })}>
          <div className="col-2 text-center">{r.severity}</div>
          <div className="col-2 text-center">{r.line}</div>
          <div className={`col-8 ${classes.breakWords}`}>{r.message}</div>
        </div>)
      }
    </div>
    </>
}

export default connect(state => ({
    validationInProgress: state.validationInProgress,
    validationResultsInfo: getValidationResultsInfo(state),
  }))(ValidatorResults);