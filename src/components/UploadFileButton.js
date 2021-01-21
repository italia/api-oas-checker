import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { setDocumentUrl, resetValidationResults } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';

const UploadFileButton = ({ isValidationInProgress, setDocumentUrl, resetValidationResults }) => {
  const loadFile = useCallback(
    (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadedEvent) => {
        setDocumentUrl(loadedEvent.target.result);
        resetValidationResults();
      };
      reader.readAsDataURL(file);
    },
    [setDocumentUrl, resetValidationResults]
  );

  const labelAsButton = cx(
    {
      disabled: isValidationInProgress,
    },
    ['btn', 'btn-custom-white']
  );

  return (
    <label role="button" className={labelAsButton}>
      Upload file <input type="file" hidden onChange={loadFile} />
    </label>
  );
};

UploadFileButton.propTypes = {
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
)(UploadFileButton);
