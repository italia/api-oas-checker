import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDocumentText, isValidationInProgress } from '../redux/selectors.js';
import { Button } from 'design-react-kit';
import { downloadFile } from '../utils.mjs';

const SaveFileButton = ({ isValidationInProgress, documentText }) => {
  const saveFile = useCallback(() => {
    downloadFile(documentText, `api-spec-${new Date().toISOString()}.yaml`, 'yaml');
  }, [documentText]);
  return (
    <Button
      color="primary"
      disabled={isValidationInProgress || documentText === ''}
      icon={false}
      tag="button"
      onClick={saveFile}
    >
      Save file
    </Button>
  );
};

SaveFileButton.propTypes = {
  isValidationInProgress: PropTypes.bool.isRequired,
  documentText: PropTypes.string,
};

export default connect((state) => ({
  isValidationInProgress: isValidationInProgress(state),
  documentText: getDocumentText(state),
}))(SaveFileButton);
