import React, { useCallback, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Icon } from 'design-react-kit';
import { useSelector } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'design-react-kit';
import { getDocumentText, isValidationInProgress } from '../redux/selectors.js';
import { b64url_encode } from '../utils.mjs';
import { SwaggerPanel } from './SwaggerPanel.js';
import { APICanvasPanel } from './APICanvasPanel.js';
import useModalView from './useModalView.js';
import './SwaggerPanel.css';

const MAX_SNIPPET_SIZE = 16000;

export const ShowButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const documentText = useSelector((state) => getDocumentText(state));
  const isDocumentTextTooLong = (documentText) => new TextEncoder().encode(documentText).length > MAX_SNIPPET_SIZE;
  const editorTextAsUrl = () => {
    if (isDocumentTextTooLong(documentText)) {
      alert('Snippet is too long.');
    } else {
      const url = `${window.location.origin}${window.location.pathname}#text=${b64url_encode(documentText)}`;
      if (window.navigator.clipboard) {
        window.navigator.clipboard.writeText(url).then(() => {
          alert('Snippet url copied to clipboard!');
        });
      } else {
        alert('Dev mode: snipped url is only available in console');
        console.log(`Snippet url: ${url}`);
      }
    }
  };

  const SwaggerPanelModal = () => {
    const [isModalOpen, closeModal, openModal] = useModalView();
    const handleConfirmAction = useCallback(() => {
      closeModal();
    }, [closeModal]);

    return (
      <DropdownItem onClick={openModal}>
        <Icon className="left" icon="it-fullscreen" aria-hidden size="sm" />
        Show schema
        <Modal className={'modal-xl'} fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal}>
          <ModalHeader charCode={215} closeAriaLabel="Close" tag="h5" wrapTag="div" toggle={closeModal}>
            Schemas
          </ModalHeader>
          <ModalBody className="mt-3" tag="div">
            <SwaggerPanel />
          </ModalBody>
          <ModalFooter tag="div">
            <Button color="primary" icon={false} onClick={handleConfirmAction} tag="button">
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </DropdownItem>
    );
  };

  const APICanvasPanelModal = () => {
    const [isModalOpen, closeModal, openModal] = useModalView();
    const handleConfirmAction = useCallback(() => {
      closeModal();
    }, [closeModal]);
    return (
      <DropdownItem onClick={openModal}>
        <Icon className="left" icon="it-fullscreen" aria-hidden size="sm" />
        Show API Canvas
        <Modal className={'modal-fs'} fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal}>
          <ModalHeader charCode={215} closeAriaLabel="Close" tag="h5" wrapTag="div" toggle={closeModal}>
            API Canvas
          </ModalHeader>
          <ModalBody className="mt-3" tag="div">
            <APICanvasPanel />
          </ModalBody>
          <ModalFooter tag="div">
            <Button color="primary" icon={false} onClick={handleConfirmAction} tag="button">
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </DropdownItem>
    );
  };

  const [open, toggle] = useState(false);
  return (
    <Dropdown isOpen={open} toggle={() => toggle(!open)}>
      <DropdownToggle color="primary" disabled={validationInProgress} outline caret>
        Show ...
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          <Icon className="left" icon="it-copy" aria-hidden size="sm" />
          <span onClick={editorTextAsUrl}>Editor text as URL</span>
        </DropdownItem>
        {SwaggerPanelModal()}
        {APICanvasPanelModal()}
      </DropdownMenu>
    </Dropdown>
  );
};
