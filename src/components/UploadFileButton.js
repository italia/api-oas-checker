import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setDocumentUrl, setValidationResults, resetValidationResults } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';
import cx from 'classnames';

const UploadFileButton = ({ isValidationInProgress, className, setDocumentUrl, resetValidationResults }) => {
  const loadFile = useCallback((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (loadedEvent) => {
      setDocumentUrl(loadedEvent.target.result);
      resetValidationResults();
    };
    reader.readAsDataURL(file);
  }, []);

  const labelAsButton = cx(
    {
      disabled: isValidationInProgress,
    },
    ['btn', 'btn-primary', `${className}`]
  );

  return (
    <>
      <label role="button" className={labelAsButton}>
        Upload file <input type="file" hidden onChange={loadFile} />
      </label>
    </>
  );
};

UploadFileButton.propTypes = {
  className: PropTypes.string.isRequired,
  isValidationInProgress: PropTypes.bool.isRequired,
  setDocumentUrl: PropTypes.func.isRequired,
  setValidationResults: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    isValidationInProgress: isValidationInProgress(state),
  }),
  {
    setDocumentUrl,
    setValidationResults,
    resetValidationResults,
  }
)(UploadFileButton);
