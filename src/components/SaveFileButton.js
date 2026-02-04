import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {Button, Icon} from 'design-react-kit';
import {getDocumentText, isValidationInProgress} from '../redux/selectors.js';
import {downloadFile} from '../utils.mjs';

export const SaveFileButton = ({ className }) => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const documentText = useSelector((state) => getDocumentText(state));
  const saveFile = useCallback(() => {
    downloadFile(documentText, `api-spec-${new Date().toISOString()}.yaml`, 'yaml');
  }, [documentText]);
  return (
    <Button
      color="primary"
      disabled={validationInProgress || documentText === ''}
      icon
      tag="button"
      onClick={saveFile}
      className={className}
    >
      <Icon icon="it-download" color="white" className="mr-2" />
      Save file
    </Button>
  );
};
