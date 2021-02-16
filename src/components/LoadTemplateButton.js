import React, { useCallback } from 'react';
import { Button } from 'design-react-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setDocumentUrl, resetValidationResults } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';
import { TEMPLATE_DOCUMENT_URL } from '../utils.mjs';

export const LoadTemplateButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const dispatch = useDispatch();
  const handleOnClick = useCallback(() => {
    dispatch(setDocumentUrl(TEMPLATE_DOCUMENT_URL));
    dispatch(resetValidationResults());
  }, [dispatch]);

  return (
    <Button onClick={handleOnClick} color="custom-white" disabled={validationInProgress} icon={false} tag="button">
      Template
    </Button>
  );
};
