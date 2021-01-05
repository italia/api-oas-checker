import React, { useCallback } from 'react';
import { Button } from 'design-react-kit';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setDocumentUrl, resetValidationResults } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';
import { TEMPLATE_DOCUMENT_URL } from '../utils.js';

const LoadTemplateButton = ({ isValidationInProgress, setDocumentUrl, resetValidationResults }) => {
  const handleOnClick = useCallback(() => {
    setDocumentUrl(TEMPLATE_DOCUMENT_URL);
    resetValidationResults();
  }, [setDocumentUrl, resetValidationResults]);

  return (
    <Button onClick={handleOnClick} color="custom-white" disabled={isValidationInProgress} icon={false} tag="button">
      Template
    </Button>
  );
};

LoadTemplateButton.propTypes = {
  isValidationInProgress: PropTypes.bool.isRequired,
  setDocumentUrl: PropTypes.func.isRequired,
  resetValidationResults: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    isValidationInProgress: isValidationInProgress(state),
  }),
  {
    setDocumentUrl,
    resetValidationResults,
  }
)(LoadTemplateButton);
