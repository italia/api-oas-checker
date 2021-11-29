import React, { useCallback } from 'react';
import { Button } from 'design-react-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setDocumentUrl, resetValidationResults } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';

export const LoadTestfileButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const dispatch = useDispatch();
  const handleOnClick = useCallback(() => {
    dispatch(setDocumentUrl('errorfile.yaml'));
    dispatch(resetValidationResults());
  }, [dispatch]);

  return (
    <Button onClick={handleOnClick} color="custom-white" disabled={validationInProgress} icon={false} tag="button">
      Test
    </Button>
  );
};
