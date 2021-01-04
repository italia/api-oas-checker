import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isValidationInProgress, getRuleset } from '../redux/selectors.js';
import { setRuleset } from '../redux/actions.js';
import {
  getDocFilename,
  RULESET_BEST_PRACTICES,
  RULESET_ITALIAN,
  RULESET_ITALIAN_PLUS_SECURITY,
  RULESET_SECURITY,
} from '../utils.mjs';
import { Button } from 'design-react-kit';

const RulesetSelect = ({ isValidationInProgress, ruleset, setRuleset }) => {
  const openDoc = useCallback(() => {
    window.open(getDocFilename(ruleset));
  }, [ruleset]);
  return (
    <>
      <div className="bootstrap-select-wrapper mt-4 px-3">
        <label>Profile</label>
        <select
          className="bootstrap-select"
          disabled={isValidationInProgress}
          value={ruleset}
          onChange={(e) => setRuleset(e.target.value)}
        >
          <option value={RULESET_ITALIAN}>Italian API Guidelines</option>
          <option value={RULESET_BEST_PRACTICES}>Best Practices Only</option>
          <option value={RULESET_SECURITY}>Extra Security Checks</option>
          <option value={RULESET_ITALIAN_PLUS_SECURITY}>Italian API Guidelines + Extra Security Checks</option>
        </select>
      </div>
      <Button onClick={openDoc} color="primary" icon={false} tag="button">
        Open Doc
      </Button>
    </>
  );
};

RulesetSelect.propTypes = {
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
)(RulesetSelect);
