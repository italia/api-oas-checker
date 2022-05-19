import React, { useCallback, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useDispatch } from 'react-redux';
import { Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader } from 'design-react-kit';
import { ERROR, WARNING, INFO, HINT, autoLinkRFC } from '../utils.mjs';
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

const getValidationResultTypeStyle = (resultItem) => {
  const hoverMap = {
    error: {
      borderColor: 'var(--danger)',
      backgroundColor: 'var(--danger-hover)',
    },
    warning: {
      borderColor: 'var(--warning)',
      backgroundColor: 'var(--warning-hover)',
    },
    info: {
      borderColor: 'var(--info)',
    },
    hint: {
      borderColor: 'var(--light)',
    },
  };
  const style = hoverMap[getValidationResultType(resultItem.severity)];
  return style || {};
};
const useStyle = createUseStyles({
  resultItem: {
    composes: 'row py-2 no-gutters',
    borderLeft: '8px solid var(--white)',
    borderRight: '8px solid var(--white)',
    backgroundColor: 'var(--white)',
    '&:hover': {
      borderColor: (resultItem) => getValidationResultTypeStyle(resultItem).borderColor,
      backgroundColor: (resultItem) => getValidationResultTypeStyle(resultItem).backgroundColor,
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
  resultDescription: {
    '& p': {
      fontSize: '1rem !important',
      marginBottom: '1rem !important',
    },
  },
  info: {
    composes: 'icon icon-primary',
    width: '20px',
  },
  hint: {
    extend: type,
    border: '1px solid var(--text-dark)',
    backgroundColor: 'var(--light)',
  },
  information: {
    extend: type,
    backgroundColor: 'var(--info)',
  },
  error: {
    extend: type,
    backgroundColor: 'var(--danger)',
  },
  warning: {
    extend: type,
    border: '1px solid var(--text-dark)',
    backgroundColor: 'var(--warning)',
  },
});

export const ValidationResultItem = ({ resultItem }) => {
  const dispatch = useDispatch();
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
    dispatch(
      focusDocumentLine({ line: getValidationResultLine(resultItem), character: resultItem.range.start.character })
    );
  }, [resultItem, dispatch]);

  const handleOnAskSlackButtonClick = useCallback(() => {
    window.open('https://slack.developers.italia.it/');
  }, []);

  const descriptionMarkup = useMemo(
    () => ({
      __html: DOMPurify.sanitize(marked.parse(autoLinkRFC(resultItem?.description ?? '')), {
        USE_PROFILES: { html: true },
      }),
    }),
    [resultItem]
  );

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
              [classes.information]: getValidationResultType(resultItem.severity) === INFO,
              [classes.hint]: getValidationResultType(resultItem.severity) === HINT,
            })}
          ></div>
        </div>
        <div className={classes.resultLine}>{getValidationResultLine(resultItem)}</div>
        <div className={classes.resultMessage}>{resultItem.message}</div>
      </div>

      <Modal fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal} className={'modal-xl'}>
        <ModalHeader charCode={215} closeAriaLabel="Close" tag="h5" wrapTag="div" toggle={closeModal}>
          {resultItem.code}
        </ModalHeader>
        <ModalBody className="mt-3" tag="div">
          <div className={classes.resultDescription} dangerouslySetInnerHTML={descriptionMarkup} />
        </ModalBody>
        <ModalFooter tag="div">
          <Button
            className="white-bg"
            color="primary"
            icon={false}
            onClick={handleOnAskSlackButtonClick}
            tag="button"
            outline
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
};
