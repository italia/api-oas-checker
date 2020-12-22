import React, { useReducer, useCallback } from 'react';
import { Button, FormGroup } from 'design-react-kit';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from './Dialog.js';
import { isValidationInProgress, getRuleset } from '../redux/selectors.js';
import { setRuleset } from '../redux/actions.js';
import { RULESET_BEST_PRACTICES, RULESET_ITALIAN, RULESET_ITALIAN_PLUS_SECURITY, RULESET_SECURITY } from '../utils.js';

const initialState = {
  isDialogOpen: false,
};

// TODO: this should be replace with a custom hook!
const reducer = (state, action) => {
  switch (action.type) {
    case 'openDialog':
      return { ...state, isDialogOpen: true };
    case 'closeDialog':
      return { ...state, isDialogOpen: false };
    default:
      return state;
  }
};

const SettingsButton = ({ isValidationInProgress, className, ruleset, setRuleset }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const closeDialog = useCallback(() => {
    dispatch({ type: 'closeDialog' });
  }, [dispatch]);
  const openDialog = useCallback(() => {
    dispatch({ type: 'openDialog' });
  }, [dispatch]);
  const renderBodyDialog = useCallback(
    () => (
      <FormGroup tag="div">
        <div className="bootstrap-select-wrapper">
          <label>Profile</label>
          <select className="bootstrap-select" value={ruleset} onChange={(e) => setRuleset(e.target.value)}>
            <option value={RULESET_ITALIAN}>Italian API Guidelines</option>
            <option value={RULESET_BEST_PRACTICES}>Best Practices Only</option>
            <option value={RULESET_SECURITY}>Extra Security Checks</option>
            <option value={RULESET_ITALIAN_PLUS_SECURITY}>Italian API Guidelines + Extra Security Checks</option>
          </select>
        </div>
      </FormGroup>
    ),
    [ruleset, setRuleset, RULESET_ITALIAN_PLUS_SECURITY, RULESET_SECURITY, RULESET_BEST_PRACTICES, RULESET_ITALIAN]
  );

  return (
    <>
      <Button
        className={className}
        onClick={openDialog}
        color="primary"
        disabled={isValidationInProgress}
        icon={false}
        tag="button"
      >
        Settings
      </Button>

      <Dialog
        isOpen={state.isDialogOpen}
        title="Settings"
        labelCloseAction="Close"
        labelConfirmAction="Save"
        renderBody={renderBodyDialog}
        onCloseAction={closeDialog}
      />
    </>
  );
};

SettingsButton.propTypes = {
  className: PropTypes.string.isRequired,
  isValidationInProgress: PropTypes.bool.isRequired,
  ruleset: PropTypes.string.isRequired,
  setRuleset: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    isValidationInProgress: isValidationInProgress(state),
    ruleset: getRuleset(state),
  }),
  {
    setRuleset,
  }
)(SettingsButton);
