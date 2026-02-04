import React, { useCallback, useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Icon } from 'design-react-kit';
import { DropdownItem } from 'reactstrap';
import { useSelector } from 'react-redux';
import { CSVLink } from 'react-csv';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'design-react-kit';
import { getDocumentText, isValidationInProgress } from '../redux/selectors.js';
import { b64url_encode } from '../utils.mjs';
import { SwaggerPanel } from './SwaggerPanel.js';
import { APICanvasTable, useApiCanvasData } from './APICanvasPanel.js';
import useModalView from './useModalView.js';
import './SwaggerPanel.css';

const MAX_SNIPPET_SIZE = 16000;

export const ShowButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const documentText = useSelector((state) => getDocumentText(state));
  const isDocumentTextTooLong = (documentText) => new TextEncoder().encode(documentText).length > MAX_SNIPPET_SIZE;
  const editorTextAsUrl = () => {
    if (isDocumentTextTooLong(documentText)) {
      alert('The document is too long to be shared via URL (maximum 16KB). Try reducing the size.');
    } else {
      const url = `${window.location.origin}${window.location.pathname}#text=${b64url_encode(documentText)}`;
      if (window.navigator.clipboard) {
        window.navigator.clipboard.writeText(url).then(() => {
          alert('A shareable link containing the current editor content has been copied to your clipboard. You can use it to share your work with others.');
        });
      } else {
        alert('Development mode: The shareable link is only available in the browser console.');
        console.log(`Shareable link: ${url}`);
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
          <ModalHeader
            charCode={215}
            closeAriaLabel="Close"
            tag="h5"
            wrapTag="div"
            toggle={closeModal}
            close={
              <button className="close" onClick={closeModal}>
                <Icon icon="it-close" />
              </button>
            }
          >
            Schemas
          </ModalHeader>
          <ModalBody className="mt-3" tag="div" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
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
    const { rows, csvFilename } = useApiCanvasData();

    return (
      <DropdownItem onClick={openModal}>
        <Icon className="left" icon="it-fullscreen" aria-hidden size="sm" />
        Show API Canvas
        <Modal className={'modal-fs'} fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal}>
          <ModalHeader
            charCode={215}
            closeAriaLabel="Close"
            tag="h5"
            wrapTag="div"
            toggle={closeModal}
            close={
              <button className="close" onClick={closeModal}>
                <Icon icon="it-close" />
              </button>
            }
          >
            API Canvas
          </ModalHeader>
          <ModalBody tag="div" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
            <APICanvasTable rows={rows} />
          </ModalBody>
          <ModalFooter tag="div">
            {rows.length > 0 && (
              <CSVLink data={rows} filename={csvFilename} className="btn btn-outline-primary btn-sm mr-2" style={{ marginRight: '10px' }}>
                Download Canvas CSV
              </CSVLink>
            )}
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
