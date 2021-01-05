import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import { Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader } from 'design-react-kit';
import { ERROR, WARNING } from '../utils.mjs';
import { getRuleset } from '../redux/selectors.js';
import { focusDocumentLine } from '../redux/actions.js';
import {
  getValidationResultItemPropTypes,
  getValidationResultLine,
  getValidationResultType,
} from '../spectral/spectral_utils.js';
import useModalView from './useModalView.js';

const type = {
  margin: '8px 0px 0px 4px',
  height: '16px',
  width: '16px',
  borderRadius: '50%',
  display: 'inline-block',
};

const useStyle = createUseStyles({
  resultItem: {
    composes: 'row py-2 no-gutters',
    borderLeft: '8px solid var(--white)',
    borderRight: '8px solid var(--white)',
    backgroundColor: 'var(--white)',
    '&:hover': {
      borderColor: (resultItem) =>
        getValidationResultType(resultItem.severity) === ERROR ? 'var(--danger)' : 'var(--warning)',
      backgroundColor: (resultItem) =>
        getValidationResultType(resultItem.severity) === WARNING ? 'var(--warning-hover)' : 'var(--danger-hover)',
    },
    '&:hover $warning': {
      border: '0px',
    },
  },
  resultMessage: {
    composes: 'col-9 col-xxl-10 px-4 text-justify',
    fontSize: '0.9rem',
    marginTop: '2px',
    wordBreak: 'break-all',
  },
  resultLine: {
    composes: 'col-1 text-center',
    marginTop: '2px',
  },
  info: {
    composes: 'icon icon-primary',
    width: '20px',
  },
  error: {
    extend: type,
    backgroundColor: 'var(--danger)',
  },
  warning: {
    extend: type,
    border: '1px solid var(--warning-text-dark)',
    backgroundColor: 'var(--warning)',
  },
});

const ValidationResultItem = ({ resultItem, focusDocumentLine }) => {
  const classes = useStyle(resultItem);
  const [isModalOpen, closeModal, openModal] = useModalView();

  const handleOnInfoClick = useCallback(
    (e) => {
      openModal();
      e.stopPropagation();
    },
    [openModal]
  );

  const handleOnResultClick = useCallback(() => {
    focusDocumentLine({ line: getValidationResultLine(resultItem), character: resultItem.range.start.character });
  }, [resultItem, focusDocumentLine]);

  const handleOnAskSlackButtonClick = useCallback(() => {
    window.open('https://slack.developers.italia.it/');
  }, []);

  return (
    <>
      <div
        data-testid="validation-result-entry"
        className={classes.resultItem}
        role="button"
        onClick={handleOnResultClick}
      >
        <div className="col-2 col-xxl-1 d-flex justify-content-center">
          <div>
            <Icon type="button" className={classes.info} icon="it-info-circle" onClick={handleOnInfoClick} />
          </div>
          <div
            className={cx({
              [classes.error]: getValidationResultType(resultItem.severity) === ERROR,
              [classes.warning]: getValidationResultType(resultItem.severity) === WARNING,
            })}
          ></div>
        </div>
        <div className={classes.resultLine}>{getValidationResultLine(resultItem)}</div>
        <div className={classes.resultMessage}>{resultItem.message}</div>
      </div>

      <Modal fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal}>
        <ModalHeader charCode={215} closeAriaLabel="Close" tag="h5" wrapTag="div" toggle={closeModal}>
          {resultItem.code}
        </ModalHeader>
        <ModalBody className="mt-3" tag="div">
          {resultItem.description}
        </ModalBody>
        <ModalFooter tag="div">
          <Button
            className="white-bg"
            color="custom-white"
            icon={false}
            onClick={handleOnAskSlackButtonClick}
            tag="button"
          >
            Ask Slack
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

ValidationResultItem.propTypes = {
  resultItem: getValidationResultItemPropTypes(),
  focusDocumentLine: PropTypes.func.isRequired,
};

export default connect(null, {
  focusDocumentLine,
})(ValidationResultItem);
