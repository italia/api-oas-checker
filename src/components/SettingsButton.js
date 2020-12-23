import React, { useCallback } from 'react';
import { Button } from 'design-react-kit';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from './Dialog.js';
import { isValidationInProgress, getRuleset } from '../redux/selectors.js';
import { setRuleset } from '../redux/actions.js';
import { RULESET_BEST_PRACTICES, RULESET_ITALIAN, RULESET_ITALIAN_PLUS_SECURITY, RULESET_SECURITY } from '../utils.js';
import useDialogView from './useDialogView.js';

const SettingsButton = ({ isValidationInProgress, ruleset, setRuleset }) => {
  const [isDialogOpen, closeDialog, openDialog] = useDialogView();

  const renderBodyDialog = useCallback(
    () => (
      <div className="bootstrap-select-wrapper mb-4">
        <label>Profile</label>
        <select className="bootstrap-select" value={ruleset} onChange={(e) => setRuleset(e.target.value)}>
          <option value={RULESET_ITALIAN}>Italian API Guidelines</option>
          <option value={RULESET_BEST_PRACTICES}>Best Practices Only</option>
          <option value={RULESET_SECURITY}>Extra Security Checks</option>
          <option value={RULESET_ITALIAN_PLUS_SECURITY}>Italian API Guidelines + Extra Security Checks</option>
        </select>
      </div>
    ),
    [ruleset, setRuleset]
  );

  return (
    <>
      <Button onClick={openDialog} color="primary" disabled={isValidationInProgress} icon={false} tag="button">
        Settings
      </Button>

      <Dialog
        isOpen={isDialogOpen}
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
