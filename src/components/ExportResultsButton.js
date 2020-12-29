import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRawValidationResults, isValidationInProgress } from '../redux/selectors.js';
import { Button } from 'design-react-kit';
import { downloadFile } from '../utils.js';
import { getValidationResultsPropTypes } from '../spectral_utils.js';

const ExportResultsButton = ({ isValidationInProgress, validationResults }) => {
  const exportValidationResults = useCallback(() => {
    downloadFile(JSON.stringify(validationResults, null, 2), `oas-results-${new Date().toISOString()}.json`, 'json');
  }, [validationResults]);
  return (
    <Button
      color="primary"
      disabled={isValidationInProgress || validationResults === null || validationResults.length === 0}
      icon={false}
      tag="button"
      onClick={exportValidationResults}
    >
      Export results
    </Button>
  );
};

ExportResultsButton.propTypes = {
  isValidationInProgress: PropTypes.bool.isRequired,
  validationResults: getValidationResultsPropTypes(),
};

export default connect((state) => ({
  isValidationInProgress: isValidationInProgress(state),
  validationResults: getRawValidationResults(state),
}))(ExportResultsButton);
