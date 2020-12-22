import React, { useCallback, useState } from 'react';
import { Button, Input } from 'design-react-kit';
import Dialog from './Dialog.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setDocumentUrl } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';
import useDialogView from './useDialogView.js';

const LoadFromUrlButton = ({ isValidationInProgress, className, setDocumentUrl }) => {
  const [isDialogOpen, closeDialog, openDialog] = useDialogView();
  const [url, setUrl] = useState(null);

  const handleConfirmAction = useCallback(() => {
    setDocumentUrl(url);
    closeDialog();
  }, [url, setDocumentUrl]);

  const handleOnChange = useCallback((e) => {
    setUrl(e.target.value);
  }, []);

  return (
    <>
      <Button
        className={className}
        onClick={openDialog}
        color="primary"
        disabled={isValidationInProgress}
        icon={false}
        tag="button"
      >
        From url
      </Button>

      <Dialog
        isOpen={isDialogOpen}
        title="Load from url"
        labelCloseAction="Close"
        labelConfirmAction="Load url"
        renderBody={() => <Input label="Url" type="text" value={url} onChange={handleOnChange} />}
        onCloseAction={closeDialog}
        onConfirmAction={handleConfirmAction}
      />
    </>
  );
};

LoadFromUrlButton.propTypes = {
  className: PropTypes.string.isRequired,
  isValidationInProgress: PropTypes.bool.isRequired,
  setDocumentUrl: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    isValidationInProgress: isValidationInProgress(state),
  }),
  {
    setDocumentUrl,
  }
)(LoadFromUrlButton);
