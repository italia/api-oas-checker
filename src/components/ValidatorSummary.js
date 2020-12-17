import React from 'react';
import { Badge } from 'design-react-kit';
import { connect } from 'react-redux';
import { getValidationSummary } from '../redux/selectors.js';

const ValidatorSummary = ({ summary }) => {
  if (summary === null) return null;

  return <div className="d-flex p-3 bg-primary">
    <h4 className="pr-3">
      <Badge
        color="danger"
        pill={false}
        tag="span"
      >
        {summary.errors.length} errors
      </Badge>
    </h4>
    <h4>
      <Badge
        color="warning"
        pill={false}
        tag="span"
      >
        {summary.warnings.length} warnings
      </Badge>
    </h4>
  </div>
};

export default connect(state => ({
  summary: getValidationSummary(state)
}))(ValidatorSummary);