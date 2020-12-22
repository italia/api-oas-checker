import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'design-react-kit';
import PropTypes from 'prop-types';

const Dialog = ({
  isOpen,
  onCloseAction,
  onConfirmAction,
  labelCloseAction,
  labelConfirmAction,
  renderBody,
  title,
}) => {
  return (
    <Modal
      autoFocus
      backdrop
      backdropTransition={{
        mountOnEnter: true,
        timeout: 150,
      }}
      centered={false}
      container="body"
      fade
      isOpen={isOpen}
      keyboard
      modalTransition={{
        timeout: 300,
      }}
      returnFocusAfterClose
      role="dialog"
      scrollable={false}
      size="lg"
      unmountOnClose
      zIndex={1050}
    >
      <ModalHeader charCode={215} closeAriaLabel="Close" tag="h5" wrapTag="div">
        {title}
      </ModalHeader>
      <ModalBody className="mt-3" tag="div">
        {renderBody()}
      </ModalBody>
      <ModalFooter tag="div">
        <Button color="secondary" icon={false} onClick={onCloseAction} tag="button">
          {labelCloseAction}
        </Button>
        {onConfirmAction && (
          <Button color="primary" icon={false} onClick={onConfirmAction} tag="button">
            {labelConfirmAction}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

Dialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCloseAction: PropTypes.func.isRequired,
  onConfirmAction: PropTypes.func,
  labelCloseAction: PropTypes.string.isRequired,
  labelConfirmAction: PropTypes.string,
  renderBody: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default Dialog;
