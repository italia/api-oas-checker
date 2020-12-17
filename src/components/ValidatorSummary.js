import React from 'react';
import { Badge } from 'design-react-kit';

export const ValidatorSummary = props => {
  if (!props.results) return null;

  const errors = props.results.filter(r => r.severity === 1);
  const warnings = props.results.filter(r => r.severity !== 1);

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
}