import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'design-react-kit';
import { getRawValidationResults, isValidationInProgress } from '../redux/selectors.js';
import { downloadFile } from '../utils.mjs';

export const ExportResultsButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const validationResults = useSelector((state) => getRawValidationResults(state));
  const exportValidationResults = useCallback(() => {
    downloadFile(JSON.stringify(validationResults, null, 2), `oas-results-${new Date().toISOString()}.json`, 'json');
  }, [validationResults]);
  return (
    <Button
      color="primary"
      disabled={validationInProgress || validationResults === null || validationResults.length === 0}
      icon={false}
      tag="button"
      onClick={exportValidationResults}
      outline
    >
      Export results
    </Button>
  );
};
