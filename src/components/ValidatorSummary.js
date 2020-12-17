import React from 'react';
import { Badge } from 'design-react-kit';
import { connect } from 'react-redux';

const ValidatorSummary = React.memo(({ validationInProgress, validationResults }) => {
  if (validationInProgress || !validationResults) return null;

  // TODO: transform this in props and use a redux selector
  const errors = validationResults.filter(r => r.severity === 1);
  const warnings = validationResults.filter(r => r.severity !== 1);

  return <div className="d-flex p-3 bg-primary">
    <h4 className="pr-3">
      <Badge
        color="danger"
        pill={false}
        tag="span"
      >
        {errors.length} errors
      </Badge>
    </h4>
    <h4>
      <Badge
        color="warning"
        pill={false}
        tag="span"
      >
        {warnings.length} warnings
      </Badge>
    </h4>
  </div>
});

export default connect(state => ({
  validationInProgress: state.validationInProgress,
  validationResults: state.validationResults,
}))(ValidatorSummary);