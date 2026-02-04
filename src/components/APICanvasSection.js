import React, {useCallback} from 'react';
import {createUseStyles} from 'react-jss';
import {Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader} from 'design-react-kit';
import {CSVLink} from 'react-csv';
import {APICanvasTable, useApiCanvasData} from './APICanvasPanel.js';
import useModalView from './useModalView.js';

const useStyles = createUseStyles({
  container: {
    composes: 'px-4 py-3 bg-white border-bottom',
  },
});

export const APICanvasSection = () => {
  const classes = useStyles();
  const [isModalOpen, closeModal, openModal] = useModalView();
  const { rows, csvFilename } = useApiCanvasData();

  const handleConfirmAction = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <div className={classes.container}>
      <p className="mb-3 small font-weight-bold text-muted">API Canvas</p>
      <p className="small">
        View a comprehensive overview of API operations, including methods, paths, and parameters.
      </p>
      <Button color="primary" icon tag="button" onClick={openModal} className="justify-content-center">
        <Icon icon="it-fullscreen" color="white" className="mr-2" />
        Show Canvas
      </Button>

      <Modal className="modal-fs" fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal}>
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
            <CSVLink
              data={rows}
              filename={csvFilename}
              className="btn btn-outline-primary btn-sm mr-2"
              style={{ marginRight: '10px' }}
            >
              Download Canvas CSV
            </CSVLink>
          )}
          <Button color="primary" icon={false} onClick={handleConfirmAction} tag="button">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};