import React, {useCallback} from 'react';
import {createUseStyles} from 'react-jss';
import {Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader} from 'design-react-kit';
import {SwaggerPanel} from './SwaggerPanel.js';
import useModalView from './useModalView.js';

const useStyles = createUseStyles({
  container: {
    composes: 'px-4 py-3 bg-white border-bottom',
  },
});

export const APISchemaSection = () => {
  const classes = useStyles();
  const [isModalOpen, closeModal, openModal] = useModalView();

  const handleConfirmAction = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <div className={classes.container}>
      <p className="mb-3 small font-weight-bold text-muted">API Schemas</p>
      <p className="small">
        Explore the data models (schemas) defined in the API specifications to understand request and response structures.
      </p>
      <Button color="primary" icon tag="button" onClick={openModal} className="justify-content-center">
        <Icon icon="it-fullscreen" color="white" className="mr-2" />
        Show Schemas
      </Button>

      <Modal className="modal-xl" fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal}>
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
    </div>
  );
};