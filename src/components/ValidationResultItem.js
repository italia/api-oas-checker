import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ERROR, getResultType, getValidationResultItemPropTypes, WARNING } from '../utils.js';
import { connect } from 'react-redux';
import { getValidationResults } from '../redux/selectors.js';
import { focusDocumentLine } from '../redux/actions.js';

const type = {
  height: '16px',
  width: '16px',
  borderRadius: '50%',
  display: 'inline-block',
};

const useStyle = createUseStyles({
  resultMessage: {
    composes: 'pr-4',
    fontSize: '0.9rem',
    wordBreak: 'break-all',
  },
  resultItem: {
    composes: 'row py-2 no-gutters',
    borderLeft: '8px solid var(--white)',
    borderRight: '8px solid var(--white)',
    '&:hover': {
      borderColor: (resultItem) => (getResultType(resultItem.severity) === ERROR ? 'var(--danger)' : 'var(--warning)'),
      backgroundColor: (resultItem) =>
        getResultType(resultItem.severity) === WARNING ? 'var(--danger-hover)' : 'var(--warning-hover)',
    },
    '&:hover $warning': {
      border: '0px',
    },
  },
  error: {
    extend: type,
    backgroundColor: 'var(--danger)',
  },
  warning: {
    extend: type,
    border: '1px solid var(--warning-text-dark)',
    backgroundColor: 'var(--warning)',
  },
});

const ValidationResultItem = ({ resultItem, focusDocumentLine }) => {
  const classes = useStyle(resultItem);

  const resultInfo = {
    severity: resultItem.severity,
    line: resultItem.range.start.line,
    character: resultItem.range.start.character,
    message: resultItem.message,
  };

  const handleOnResultClick = useCallback(() => {
    focusDocumentLine({ line: resultInfo.line, character: resultInfo.character });
  }, [resultInfo, focusDocumentLine]);

  return (
    <div
      data-testid="validation-result-entry"
      className={classes.resultItem}
      role="button"
      onClick={handleOnResultClick}
    >
      <div className="col-1 text-center">
        <div
          className={cx({
            [classes.error]: getResultType(resultInfo.severity) === ERROR,
            [classes.warning]: getResultType(resultInfo.severity) === WARNING,
          })}
        ></div>
      </div>
      <div className="col-1 text-center">{resultInfo.line}</div>
      <div className={`col-10 ${classes.resultMessage}`}>{resultInfo.message}</div>
    </div>
  );
};

ValidationResultItem.propTypes = {
  resultItem: getValidationResultItemPropTypes(),
  focusDocumentLine: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    validationResults: getValidationResults(state),
  }),
  {
    focusDocumentLine,
  }
)(ValidationResultItem);
