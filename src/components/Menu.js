import React, { useCallback } from 'react';
import { Button, FormGroup } from 'design-react-kit';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import { getDocumentText, getValidationResults, isValidationInProgress } from '../redux/selectors.js';
import LoadFromUrlButton from './LoadFromUrlButton.js';
import SettingsButton from './SettingsButton.js';
import { downloadFile } from '../utils.js';

const useStyles = createUseStyles({
  formGroup: {
    composes: 'm-4 pl-3',
  },
  button: {
    composes: 'py-2 px-3',
    width: '100%',
    whiteSpace: 'nowrap', // required for a better menu animation
  },
});

const Menu = ({ isValidationInProgress, documentText, validationResults }) => {
  const classes = useStyles();

  // TODO: refactor this. Split in different components
  const saveFile = useCallback(() => {
    downloadFile(documentText, `api-spec-${new Date().toISOString()}.yaml`, 'yaml');
  }, [documentText]);

  const exportValidationResults = useCallback(() => {
    downloadFile(JSON.stringify(validationResults, null, 2), `oas-results-${new Date().toISOString()}.json`, 'json');
  }, [validationResults]);

  return (
    <>
      <div className="border-top" data-testid="menu">
        <FormGroup className={classes.formGroup} tag="div">
          <Button
            className={classes.button}
            color="primary"
            disabled={isValidationInProgress || documentText === ''}
            icon={false}
            tag="button"
            onClick={saveFile}
          >
            Save file
          </Button>
        </FormGroup>
        <FormGroup className={classes.formGroup} tag="div">
          <Button
            className={classes.button}
            color="primary"
            disabled={isValidationInProgress || validationResults === null || validationResults.length === 0}
            icon={false}
            tag="button"
            onClick={exportValidationResults}
          >
            Export results
          </Button>
        </FormGroup>
      </div>
      <div className="border-top">
        <FormGroup className={classes.formGroup} tag="div">
          <Button
            className={classes.button}
            color="primary"
            disabled={isValidationInProgress}
            icon={false}
            tag="button"
          >
            Upload file
          </Button>
        </FormGroup>
        <FormGroup className={classes.formGroup} tag="div">
          <LoadFromUrlButton className={classes.button} />
        </FormGroup>
        <FormGroup className={classes.formGroup} tag="div">
          <Button
            className={classes.button}
            color="primary"
            disabled={isValidationInProgress}
            icon={false}
            tag="button"
          >
            Template
          </Button>
        </FormGroup>
      </div>
      <div className="border-top">
        <FormGroup className={classes.formGroup} tag="div">
          <SettingsButton className={classes.button} />
        </FormGroup>
      </div>
    </>
  );
};

Menu.propTypes = {
  isValidationInProgress: PropTypes.bool.isRequired,
  documentText: PropTypes.string,
  validationResults: PropTypes.array,
};

export default connect((state) => ({
  isValidationInProgress: isValidationInProgress(state),
  documentText: getDocumentText(state),
  validationResults: getValidationResults(state),
}))(Menu);
