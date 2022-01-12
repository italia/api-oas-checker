import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'design-react-kit';
import { getDocumentText, isValidationInProgress } from '../redux/selectors.js';
import { downloadFile } from '../utils.mjs';

export const SaveFileButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const documentText = useSelector((state) => getDocumentText(state));
  const saveFile = useCallback(() => {
    downloadFile(documentText, `api-spec-${new Date().toISOString()}.yaml`, 'yaml');
  }, [documentText]);
  return (
    <Button
      color="primary"
      disabled={validationInProgress || documentText === ''}
      icon={false}
      tag="button"
      onClick={saveFile}
      outline
    >
      Save file
    </Button>
  );
};
