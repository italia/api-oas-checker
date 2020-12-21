import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import PropTypes from 'prop-types';
import cx from 'classnames';

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
      borderColor: (resultInfo) => (resultInfo.severity === 1 ? 'var(--danger)' : 'var(--warning)'),
      backgroundColor: (resultInfo) => (resultInfo.severity === 1 ? 'var(--danger-hover)' : 'var(--warning-hover)'),
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

const ValidationResultItem = ({ resultInfo, onResultClick }) => {
  const classes = useStyle(resultInfo);

  const handleOnResultClick = useCallback(() => {
    onResultClick({ line: resultInfo.line, character: resultInfo.character });
  }, [resultInfo]);

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
            [classes.error]: resultInfo.severity === 1,
            [classes.warning]: resultInfo.severity !== 1,
          })}
        ></div>
      </div>
      <div className="col-1 text-center">{resultInfo.line}</div>
      <div className={`col-10 ${classes.resultMessage}`}>{resultInfo.message}</div>
    </div>
  );
};

ValidationResultItem.propTypes = {
  resultInfo: PropTypes.shape({
    character: PropTypes.number.isRequired,
    line: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.number.isRequired,
  }).isRequired,
  onResultClick: PropTypes.func.isRequired,
};

export default ValidationResultItem;
