import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyle = createUseStyles({
  breakWords: {
    wordBreak: 'break-all'
  },
  enableScrollResults: {
    height: 'calc(100vh - 266px)',
    overflow: 'scroll'
  }
});

export const ValidatorResults = props => {
  if (props.isValidating || !props.results) return null;

  const classes = useStyle();

  return <><div className="row py-3">
    <div className="col-sm-2 text-center">
      Type
    </div>
    <div className="col-sm-2 text-center">
      Line
    </div>
    <div className="col-sm-8">
      Message
    </div>
  </div>
    <div className={classes.enableScrollResults}>
      {props.results.map(r =>
        <div className="row py-3" role="button" key={r.fingerprint} onClick={() => props.onResultClick({ line: r.range.start.line, character: r.range.start.character })}>
          <div className="col-sm-2 text-center">{r.severity}</div>
          <div className="col-sm-2 text-center">{r.range.start.line}</div>
          <div className={`col-sm-8 ${classes.breakWords}`}>{r.message}</div>
        </div>)
      }
    </div>
    </>
}