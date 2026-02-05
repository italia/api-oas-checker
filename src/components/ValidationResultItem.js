import React, {useCallback, useId, useMemo, useState} from 'react';
import {createUseStyles} from 'react-jss';
import cx from 'classnames';
import DOMPurify from 'dompurify';
import {marked} from 'marked';
import {useDispatch, useSelector} from 'react-redux';
import {
  Badge,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  notify
} from 'design-react-kit';
import {DropdownItem, UncontrolledTooltip} from 'reactstrap';
import {autoLinkRFC, ERROR, HINT, INFO, WARNING} from '../utils.mjs';
import {focusDocumentLine} from '../redux/actions.js';
import {getRuleset} from '../redux/selectors.js';
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
    composes: 'col-9 px-4 text-justify',
    fontSize: '0.9rem',
    marginTop: '2px',
    wordBreak: 'break-all',
  },
  actions: {
    composes: 'col-1 col-xxl-1 d-flex justify-content-evenly',
    marginTop: '2px',
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
  metadataContainer: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f5f5f5', // Using a light grey fallback if var not available, or I should use a generic bootstrap bg class
    borderRadius: '4px',
  },
  metadataRow: {
    display: 'flex',
    marginBottom: '0.5rem',
    alignItems: 'baseline',
  },
  metadataLabel: {
    fontWeight: 'bold',
    minWidth: '100px',
    color: '#333',
  },
  metadataValue: {
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    fontSize: '0.9rem',
  },
});

export const ValidationResultItem = ({ resultItem }) => {
  const dispatch = useDispatch();
  const rulesetPath = useSelector(getRuleset);
  const classes = useStyle(resultItem);
  const [isModalOpen, closeModal, openModal] = useModalView();
  const [isCopyDropdownOpen, setIsCopyDropdownOpen] = useState(false);
  const id = useId().replace(/:/g, '-');

  const rulesetInfo = typeof FILES_DICTIONARY !== 'undefined' ? FILES_DICTIONARY[rulesetPath] : null;
  const rulesetText = rulesetInfo ? `Ruleset: ${rulesetInfo.rulesetName} (${rulesetInfo.rulesetVersion})` : '';

  const handleOnInfoClick = useCallback(
    (e) => {
      openModal();
      e.stopPropagation();
    },
    [openModal]
  );

  const getResultText = useCallback(() => {
    return `Line ${getValidationResultLine(resultItem)}: ${resultItem.message}
${rulesetText}
Rule: ${resultItem.code}
Description: ${resultItem.description || ''}`;
  }, [resultItem, rulesetText]);

  const handleOnCopyClick = useCallback(
    (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(getResultText());
    },
    [getResultText]
  );

  const handleOnResultClick = useCallback(() => {
    dispatch(
      focusDocumentLine({ line: getValidationResultLine(resultItem), character: resultItem.range.start.character })
    );
  }, [resultItem, dispatch]);

  const handleGoToError = useCallback(() => {
      closeModal();
      handleOnResultClick();
  }, [closeModal, handleOnResultClick]);
  
  const handleCopyJSON = useCallback(() => {
      setIsCopyDropdownOpen(false);
      navigator.clipboard.writeText(JSON.stringify(resultItem, null, 2));
      notify('Copied!', 'Details copied to clipboard (JSON)', { state: 'success' });
  }, [resultItem]);

  const handleCopyText = useCallback(() => {
      setIsCopyDropdownOpen(false);
      navigator.clipboard.writeText(getResultText());
      notify('Copied!', 'Details copied to clipboard (Text)', { state: 'success' });
  }, [getResultText]);

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

  const severityType = getValidationResultType(resultItem.severity);
  const badgeColor = {
      [ERROR]: 'danger',
      [WARNING]: 'warning',
      [INFO]: 'info',
      [HINT]: 'secondary',
  }[severityType] || 'secondary';

  const toggleCopyDropdown = () => setIsCopyDropdownOpen(!isCopyDropdownOpen);

  return (
    <>
      <div
        data-testid="validation-result-entry"
        className={classes.resultItem}
        role="button"
        onClick={handleOnResultClick}
      >
        <div className="col-1 d-flex justify-content-center">
          <div
            className={cx({
              [classes.error]: severityType === ERROR,
              [classes.warning]: severityType === WARNING,
              [classes.information]: severityType === INFO,
              [classes.hint]: severityType === HINT,
            })}
          ></div>
        </div>
        <div className={classes.resultLine}>{getValidationResultLine(resultItem)}</div>
        <div className={classes.resultMessage}>{resultItem.message}</div>
        <div className={classes.actions}>
          <Icon
            type="button"
            className={classes.info}
            icon="it-info-circle"
            onClick={handleOnInfoClick}
            id={`info-icon-${id}`}
          />
          <UncontrolledTooltip placement="top" target={`info-icon-${id}`}>
            Show details
          </UncontrolledTooltip>
          <Icon
            type="button"
            className={classes.info}
            icon="it-copy"
            onClick={handleOnCopyClick}
            id={`copy-icon-${id}`}
          />
          <UncontrolledTooltip placement="top" target={`copy-icon-${id}`}>
            Copy to clipboard
          </UncontrolledTooltip>
        </div>
      </div>

      <Modal fade={false} isOpen={isModalOpen} role="dialog" centered toggle={closeModal} className={'modal-xl'}>
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
          <div className="d-flex align-items-center flex-wrap">
             <Badge color={badgeColor} className="mr-3 text-white" style={{marginRight: '12px'}}>{severityType.toUpperCase()}</Badge>
             <span className="mr-2" style={{marginRight: '8px'}}>{resultItem.code}</span>
             {rulesetInfo && (
                <small className="text-muted">
                   - {rulesetInfo.rulesetName} ({rulesetInfo.rulesetVersion})
                </small>
             )}
          </div>
        </ModalHeader>
        <ModalBody className="mt-3" tag="div">
          <div className={classes.metadataContainer}>
            <div className={classes.metadataRow}>
              <span className={classes.metadataLabel}>Message:</span>
              <span className={classes.metadataValue}>{resultItem.message}</span>
            </div>
             <div className={classes.metadataRow}>
              <span className={classes.metadataLabel}>Path:</span>
              <span className={classes.metadataValue}>
                 {resultItem.path && resultItem.path.length > 0 ? resultItem.path.join(' > ') : '(root)'}
              </span>
            </div>
            <div className={classes.metadataRow}>
              <span className={classes.metadataLabel}>Location:</span>
              <span className={classes.metadataValue}>
                 Line {getValidationResultLine(resultItem)}, Character {resultItem.range.start.character}
              </span>
            </div>
          </div>
          
          {resultItem.description && (
             <div className={classes.resultDescription}>
                <h6 className="font-weight-bold mb-2">Description</h6>
                <div dangerouslySetInnerHTML={descriptionMarkup} />
             </div>
          )}
        </ModalBody>
        <ModalFooter tag="div">
          <Button
            color="primary"
            icon={false}
            onClick={handleGoToError}
            tag="button"
            outline
            className="mr-2"
          >
            Go to error
          </Button>
          
          <Dropdown isOpen={isCopyDropdownOpen} toggle={toggleCopyDropdown} className="mr-2 btn-group">
            <DropdownToggle color="primary" caret outline>
              Copy details
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={handleCopyText}>Copy as text</DropdownItem>
              <DropdownItem onClick={handleCopyJSON}>Copy as JSON</DropdownItem>
            </DropdownMenu>
          </Dropdown>

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