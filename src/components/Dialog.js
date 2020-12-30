import React, { useEffect } from 'react';
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
  useEffect(() => {
    const bindKeyboardEvent = (e) => {
      if (e.keyCode === 27) {
        onCloseAction();
      }
      if (e.keyCode === 13) {
        onConfirmAction();
      }
    };
    window.addEventListener('keydown', bindKeyboardEvent);
    return () => window.removeEventListener('keydown', bindKeyboardEvent);
  }, [onCloseAction, onConfirmAction]);
  return (
    <Modal isOpen={isOpen} role="dialog" size="lg">
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
