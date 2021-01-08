import React, { useCallback, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'design-react-kit';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setDocumentUrl, resetValidationResults } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';
import useModalView from './useModalView.js';

const LoadFromUrlButton = ({ isValidationInProgress, setDocumentUrl, resetValidationResults }) => {
  const [isModalOpen, closeModal, openModal] = useModalView();
  const [url, setUrl] = useState('');

  const handleConfirmAction = useCallback(() => {
    setDocumentUrl(url);
    resetValidationResults();
    closeModal();
  }, [url, setDocumentUrl, resetValidationResults, closeModal]);

  const handleOnChange = useCallback((e) => {
    setUrl(e.target.value);
  }, []);

  return (
    <>
      <Button onClick={openModal} color="custom-white" disabled={isValidationInProgress} icon={false} tag="button">
        From url
      </Button>

      <Modal fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal}>
        <ModalHeader charCode={215} closeAriaLabel="Close" tag="h5" wrapTag="div" toggle={closeModal}>
          Load from url
        </ModalHeader>
        <ModalBody className="mt-3" tag="div">
          <Input label="Url" type="text" value={url} onChange={handleOnChange} />
        </ModalBody>
        <ModalFooter tag="div">
          <Button color="primary" icon={false} onClick={handleConfirmAction} tag="button">
            Load Url
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

LoadFromUrlButton.propTypes = {
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
)(LoadFromUrlButton);
