import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';

const useStyle = createUseStyles({
  breakWords: {
    wordBreak: 'break-all'
  },
  enableScrollResults: {
    height: 'calc(100vh - 266px)',
    overflow: 'scroll'
  }
});

const ValidatorResults = ({ validationInProgress, validationResults, onResultClick }) => {
  if (validationInProgress || !validationResults) return null;

  // TODO: transform type, severity and message in props with redux selector

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
      {validationResults.map(r =>
        <div className="row py-3" role="button" key={r.fingerprint} onClick={() => onResultClick({ line: r.range.start.line, character: r.range.start.character })}>
          <div className="col-2 text-center">{r.severity}</div>
          <div className="col-2 text-center">{r.range.start.line}</div>
          <div className={`col-8 ${classes.breakWords}`}>{r.message}</div>
        </div>)
      }
    </div>
    </>
}

export default connect(state => ({
  validationInProgress: state.validationInProgress,
  validationResults: state.validationResults,
}))(ValidatorResults);