import React, { useCallback, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'design-react-kit';
import SwaggerUI from 'swagger-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { setDocumentUrl, resetValidationResults, setTemplateDocumentName } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';
import { TEMPLATE_DOCUMENT_URL } from '../utils.mjs';
import useModalView from './useModalView.js';

export const LoadTestfileButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const dispatch = useDispatch();
  const [isModalOpen, closeModal, openModal] = useModalView();
  const handleConfirmAction = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const handleOnClick = useCallback(
    (url) => {
      console.log(`Loading ${url}`);
      setTemplateDocumentName(url);
      dispatch(setDocumentUrl(url));
      dispatch(resetValidationResults());
    },
    [dispatch]
  );
  const schema = {
    type: 'object',
    properties: {
      url: {
        type: 'string',
      },
    },
  };

  /*

              */
  const [open, toggle] = useState(false);
  return (
    <Dropdown isOpen={open} toggle={() => toggle(!open)}>
      <DropdownToggle color="primary" disabled={validationInProgress} outline caret>
        From template...
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => handleOnClick(TEMPLATE_DOCUMENT_URL)}>
          <Icon className="left" icon="it-upload" aria-hidden size="sm" /> Example API
        </DropdownItem>
        <DropdownItem onClick={() => handleOnClick('errorfile.yaml')}>
          <Icon className="left" icon="it-upload" aria-hidden size="sm" /> Example API with error
        </DropdownItem>

        <DropdownItem onClick={openModal}>
          <Icon className="left" icon="it-upload" aria-hidden size="sm" />
          Show schema
          <Modal fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal}>
            <ModalHeader charCode={215} closeAriaLabel="Close" tag="h5" wrapTag="div" toggle={closeModal}>
              Mostra schema
            </ModalHeader>
            <ModalBody className="mt-3" tag="div">
              <SwaggerUI />
            </ModalBody>
            <ModalFooter tag="div">
              <Button color="primary" icon={false} onClick={handleConfirmAction} tag="button">
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
