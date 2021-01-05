import React, { useMemo, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ERROR, WARNING } from '../utils.js';
import { connect } from 'react-redux';
import { getValidationResults } from '../redux/selectors.js';
import { focusDocumentLine } from '../redux/actions.js';
import {
  getValidationResultItemPropTypes,
  getValidationResultLine,
  getValidationResultType,
} from '../spectral/spectral_utils.js';

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
      borderColor: (resultItem) =>
        getValidationResultType(resultItem.severity) === ERROR ? 'var(--danger)' : 'var(--warning)',
      backgroundColor: (resultItem) =>
        getValidationResultType(resultItem.severity) === WARNING ? 'var(--warning-hover)' : 'var(--danger-hover)',
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

  const resultInfo = useMemo(
    () => ({
      character: resultItem.range.start.character,
      description: resultItem.description,
      line: getValidationResultLine(resultItem),
      message: resultItem.message,
      severity: resultItem.severity,
    }),
    [resultItem]
  );

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
            [classes.error]: getValidationResultType(resultInfo.severity) === ERROR,
            [classes.warning]: getValidationResultType(resultInfo.severity) === WARNING,
          })}
        ></div>
      </div>
      <div className="col-2 col-xxl-1 text-center">{resultInfo.line}</div>
      <div className={`col-9 col-xxl-10 ${classes.resultMessage}`}>{resultInfo.message}</div>
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
