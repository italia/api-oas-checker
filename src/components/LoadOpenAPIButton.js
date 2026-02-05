import React, {useCallback, useRef, useState} from 'react';
import {createUseStyles} from 'react-jss';
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

const useStyles = createUseStyles({
  modalBody: {
    padding: '1.5rem !important',
    '& div.form-group': {
      marginBottom: '0 !important',
    },
  },
});

export const LoadOpenAPIButton = () => {
  const classes = useStyles();
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
        <ModalHeader
          charCode={215}
          closeAriaLabel="Close"
          tag="h5"
          wrapTag="div"
          toggle={closeUrlModal}
          close={
            <button className="close" onClick={closeUrlModal}>
              <Icon icon="it-close" />
            </button>
          }
        >
          <div className="d-flex align-items-center">
            <Icon icon="it-link" className="mr-2" style={{marginRight: '12px'}} />
            <span>Load from URL</span>
          </div>
        </ModalHeader>
        <ModalBody className={classes.modalBody} tag="div">
          <p className="mb-5">Enter the public URL of your OpenAPI definition (YAML or JSON).</p>
          <Input
            label="URL"
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="https://example.com/openapi.yaml"
          />
          <small className="form-text text-muted mt-3">The resource must be publicly accessible (CORS enabled).</small>
        </ModalBody>
        <ModalFooter tag="div">
          <Button 
            color="primary" 
            icon={false} 
            onClick={handleUrlConfirm} 
            tag="button" 
            disabled={!url || !url.trim()}
          >
            Load URL
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
