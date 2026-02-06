import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createUseStyles} from 'react-jss';
import {Button, Icon} from 'design-react-kit';
import {UncontrolledTooltip} from 'reactstrap';
import {LoadOpenAPIButton} from './LoadOpenAPIButton.js';
import {getDocumentText, getFilename, isValidationInProgress} from '../redux/selectors.js';
import {resetValidationResults, setDocumentText, setFilename} from '../redux/actions.js';
import {b64url_encode} from '../utils.mjs';

const MAX_SNIPPET_SIZE = 16000;

const useStyles = createUseStyles({
  container: {
    composes: 'px-4 py-3 bg-white border-bottom',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    width: '100%',
    gap: '10px',
    alignItems: 'center',
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    width: '100%',
    color: 'var(--primary)',
    marginTop: '1rem',
    marginBottom: 0,
  },
  info: {
    composes: 'icon icon-primary mx-1',
    width: '24px',
    height: '24px',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
});

export const LoadOpenAPISection = () => {
  const classes = useStyles();
  const filename = useSelector((state) => getFilename(state));
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const documentText = useSelector((state) => getDocumentText(state));
  const dispatch = useDispatch();

  const handleClear = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the editor?')) {
      dispatch(setDocumentText(''));
      dispatch(setFilename(null));
      dispatch(resetValidationResults());
    }
  }, [dispatch]);

  const isDocumentTextTooLong = (text) => new TextEncoder().encode(text).length > MAX_SNIPPET_SIZE;

  const handleCreateUrl = useCallback(() => {
    if (isDocumentTextTooLong(documentText)) {
      alert('The document is too long to be shared via URL (maximum 16KB). Try reducing the size.');
    } else {
      const url = `${window.location.origin}${window.location.pathname}#text=${b64url_encode(documentText)}`;
      if (window.navigator.clipboard) {
        window.navigator.clipboard.writeText(url).then(() => {
          alert('A shareable link containing the current editor content has been copied to your clipboard.');
        });
      } else {
        alert('Development mode: The shareable link is only available in the browser console.');
        console.log(`Shareable link: ${url}`);
      }
    }
  }, [documentText]);

  return (
    <div className={classes.container}>
      <p className="mb-2 small font-weight-bold text-muted">Step 1. Load the OpenAPI interface</p>
      <div className={classes.buttonGroup}>
        <div className="flex-grow-1">
          <LoadOpenAPIButton />
        </div>
        <Button
          color="primary"
          outline
          onClick={handleCreateUrl}
          disabled={validationInProgress || !documentText}
          tag="button"
          icon={false}
          id="create-url-button"
        >
          <Icon icon="it-copy" size="sm" />
        </Button>
        <UncontrolledTooltip placement="top" target="create-url-button">
          Create a shareable URL with the current editor content
        </UncontrolledTooltip>
        <Button
          color="danger"
          outline
          onClick={handleClear}
          disabled={validationInProgress}
          tag="button"
          icon={false}
        >
          Clear
        </Button>
      </div>
      {filename && (
        <p className={classes.fileInfo}>
          <Icon className={classes.info} icon="it-file" /> Selected File: {filename}
        </p>
      )}
    </div>
  );
};