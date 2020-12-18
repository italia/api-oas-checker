import React from 'react';
import cx from 'classnames';
import { Button, Icon, Label, Input, FormGroup } from 'design-react-kit';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isValidationInProgress } from '../redux/selectors.js';

const useStyles = createUseStyles({
  validatorIconSize: {
    fontSize: '1.5rem',
  },
});

const ValidationController = ({ isValidationInProgress, onValidate }) => {
  const classes = useStyles();
  const formGroupButtonValidateCx = cx(
    {
      'flex-grow-1': isValidationInProgress,
    },
    'm-3'
  );
  const buttonValidateCx = cx(
    {
      'w-100': isValidationInProgress,
    },
    'py-2',
    'px-3'
  );

  const onValidationButtonClick = isValidationInProgress ? Function.prototype : onValidate;

  return (
    <div className="d-flex align-items-center">
      <FormGroup className={formGroupButtonValidateCx} tag="div">
        <Button
          data-testid="validation-button"
          className={buttonValidateCx}
          color="primary"
          icon
          tag="button"
          onClick={onValidationButtonClick}
        >
          {isValidationInProgress ? 'Please wait...' : 'Validate'}
          <Icon className={`ml-3 ${classes.validatorIconSize}`} color="white" icon="it-refresh" />
        </Button>
      </FormGroup>

      {!isValidationInProgress && (
        <FormGroup check className="m-3" tag="div">
          <div data-testid="auto-refresh" className="toggles">
            <Label className="m-0 font-weight-light" check>
              Auto-refresh
              <Input type="checkbox" defaultChecked />
              <span className="lever" />
            </Label>
          </div>
        </FormGroup>
      )}
    </div>
  );
};

ValidationController.propTypes = {
  isValidationInProgress: PropTypes.bool.isRequired,
  onValidate: PropTypes.func.isRequired,
};

export default connect((state) => ({ isValidationInProgress: isValidationInProgress(state) }))(ValidationController);
