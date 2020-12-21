import React, { useEffect, useCallback } from 'react';
import { Button, FormGroup } from 'design-react-kit';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import { getDocumentText, getValidationResults, isValidationInProgress } from '../redux/selectors.js';
import { setDocumentUrl } from '../redux/actions.js';

const useStyles = createUseStyles({
  button: {
    composes: 'py-2 px-3',
    whiteSpace: 'nowrap', // required for a better menu animation
  },
});

const downloadFile = (content, fileName, contentType) => {
  const anchorElement = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  anchorElement.href = URL.createObjectURL(file);
  anchorElement.download = fileName;
  anchorElement.click();
};

const Menu = ({ isValidationInProgress, documentText, validationResults, setDocumentUrl }) => {
  const classes = useStyles();

  useEffect(() => {
    setDocumentUrl('example.yaml'); // TODO: put this in the initial state
  }, [setDocumentUrl]);

  const saveFile = useCallback(() => {
    downloadFile(documentText, `api-spec-${new Date().toISOString()}.yaml`, 'yaml');
  }, [documentText]);

  const exportValidationResults = useCallback(() => {
    downloadFile(JSON.stringify(validationResults, null, 2), `oas-results-${new Date().toISOString()}.json`, 'json');
  }, [validationResults]);

  // TODO: refactor this
  return (
    <>
      <div className="border-top" data-testid="menu">
        <FormGroup className="m-4" tag="div">
          <Button
            className={classes.button}
            color="primary"
            disabled={isValidationInProgress || documentText === ''}
            icon
            tag="button"
            onClick={saveFile}
          >
            Save file
          </Button>
        </FormGroup>
        <FormGroup className="m-4" tag="div">
          <Button
            className={classes.button}
            color="primary"
            disabled={isValidationInProgress || validationResults === null || validationResults.length === 0}
            icon
            tag="button"
            onClick={exportValidationResults}
          >
            Export results
          </Button>
        </FormGroup>
      </div>
      <div className="border-top">
        <FormGroup className="m-4" tag="div">
          <Button className={classes.button} color="primary" disabled={isValidationInProgress} icon tag="button">
            Upload file
          </Button>
        </FormGroup>
        <FormGroup className="m-4" tag="div">
          <Button className={classes.button} color="primary" disabled={isValidationInProgress} icon tag="button">
            From url
          </Button>
        </FormGroup>
        <FormGroup className="m-4" tag="div">
          <Button className={classes.button} color="primary" disabled={isValidationInProgress} icon tag="button">
            Template
          </Button>
        </FormGroup>
      </div>
      <div className="border-top">
        <FormGroup className="m-4" tag="div">
          <Button className={classes.button} color="primary" disabled={isValidationInProgress} icon tag="button">
            Settings
          </Button>
        </FormGroup>
      </div>
    </>
  );
};

Menu.propTypes = {
  isValidationInProgress: PropTypes.bool.isRequired,
  documentText: PropTypes.string,
  validationResults: PropTypes.array,
  setDocumentUrl: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    isValidationInProgress: isValidationInProgress(state),
    documentText: getDocumentText(state),
    validationResults: getValidationResults(state),
  }),
  {
    setDocumentUrl,
  }
)(Menu);
