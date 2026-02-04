import React, {useCallback, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'design-react-kit';
import {DropdownItem} from 'reactstrap';
import {resetValidationResults, setDocumentFile, setDocumentUrl, setFilename} from '../redux/actions.js';
import {isValidationInProgress} from '../redux/selectors.js';
import useModalView from './useModalView.js';

export const LoadOpenAPIButton = () => {
  const dispatch = useDispatch();
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Modal logic for URL
  const [isUrlModalOpen, closeUrlModal, openUrlModal] = useModalView();
  const [url, setUrl] = useState('');

  const toggle = () => setOpen(!open);

  // Upload Logic
  const handleUploadClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };
  const handleFileChange = useCallback((e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = (loadedEvent) => {
          dispatch(setDocumentFile(loadedEvent.target.result));
          dispatch(setFilename(file.name));
          dispatch(resetValidationResults());
        };
        reader.readAsText(file, 'UTF-8');
      }
      // Reset input value to allow re-uploading same file
      e.target.value = '';
  }, [dispatch]);

  // URL Logic
  const handleUrlClick = () => {
      openUrlModal();
  };
  const handleUrlConfirm = useCallback(() => {
    dispatch(setDocumentUrl(url));
    dispatch(setFilename(null));
    dispatch(resetValidationResults());
    closeUrlModal();
  }, [url, closeUrlModal, dispatch]);

  return (
    <>
    <Dropdown isOpen={open} toggle={toggle}>
      <DropdownToggle color="primary" outline caret disabled={validationInProgress}>
        Load OpenAPI ...
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={handleUploadClick}>
          <Icon className="left" icon="it-upload" aria-hidden size="sm" />
          Load File
        </DropdownItem>
        <DropdownItem onClick={handleUrlClick}>
          <Icon className="left" icon="it-link" aria-hidden size="sm" />
          Load from URL
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <input
        type="file"
        accept=".yaml, .yml, .json"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
    />

    <Modal fade={false} isOpen={isUrlModalOpen} role="dialog" centered toggle={closeUrlModal}>
        <ModalHeader charCode={215} closeAriaLabel="Close" tag="h5" wrapTag="div" toggle={closeUrlModal}>
          Load from URL
        </ModalHeader>
        <ModalBody className="mt-3" tag="div">
          <Input label="URL" type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </ModalBody>
        <ModalFooter tag="div">
          <Button color="primary" icon={false} onClick={handleUrlConfirm} tag="button">
            Load URL
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
