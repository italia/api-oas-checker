import React, { useCallback, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'design-react-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setDocumentUrl, resetValidationResults } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';
import useModalView from './useModalView.js';

export const LoadFromUrlButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const dispatch = useDispatch();
  const [isModalOpen, closeModal, openModal] = useModalView();
  const [url, setUrl] = useState('');

  const handleConfirmAction = useCallback(() => {
    dispatch(setDocumentUrl(url));
    dispatch(resetValidationResults());
    closeModal();
  }, [url, closeModal, dispatch]);

  const handleOnChange = useCallback((e) => {
    setUrl(e.target.value);
  }, []);

  return (
    <>
      <Button onClick={openModal} color="primary" disabled={validationInProgress} icon={false} tag="button" outline>
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
