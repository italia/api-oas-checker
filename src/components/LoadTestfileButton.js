import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createUseStyles } from 'react-jss';
import { setDocumentUrl, resetValidationResults, setTemplateDocumentName } from '../redux/actions.js';
import { getTemplateDocumentName, isValidationInProgress } from '../redux/selectors.js';
import { TEMPLATE_DOCUMENT_URL } from '../utils.mjs';

const useStyles = createUseStyles({
  select: {
    textAlign: 'center',
    fontSize: '0.9rem',
    width: '256px',
  },
});

export const LoadTestfileButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const templateDocumentName = useSelector((state) => getTemplateDocumentName(state));
  const dispatch = useDispatch();
  const handleOnClick = useCallback(
    (url) => {
      console.log(`Loading ${url}`);
      setTemplateDocumentName(url);
      dispatch(setDocumentUrl(url));
      dispatch(resetValidationResults());
    },
    [dispatch]
  );

  const classes = useStyles();
  return (
    <div className="pt-3 d-flex align-items-center bg-white">
      <select
        className={classes.select + ' btn btn-custom-white'}
        disabled={validationInProgress}
        value={templateDocumentName}
        onChange={(e) => handleOnClick(e.target.value)}
      >
        <option value={''}> From template.. </option>
        <option value={TEMPLATE_DOCUMENT_URL}> API template </option>
        <option value={'errorfile.yaml'}> Error Test File </option>
      </select>
    </div>
  );
};
