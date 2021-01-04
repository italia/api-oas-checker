import React from 'react';
import { Button, Icon, Label, Input, FormGroup } from 'design-react-kit';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  validatorIconSize: {
    fontSize: '1.5rem'
  }
});

export const ValidatorControllers = props => {
  const classes = useStyles();

  // TODO: refactor this
  if (props.isValidating) {
    return <div className="d-flex align-items-center">
      <FormGroup
        className="m-3 flex-grow-1"
        tag="div"
      >
        <Button
          className="py-2 px-3 w-100"
          color="primary"
          icon
          tag="button"
        >
          Please wait...
          <Icon className={`ml-3 ${classes.validatorIconSize}`} color="white" icon="it-refresh"/>
        </Button>
      </FormGroup>
    </div>
  }
  return <div className="d-flex align-items-center">
    <FormGroup
      className="m-3"
      tag="div"
    >
      <Button
        className="py-2 px-3"
        color="primary"
        icon
        tag="button"
        onClick={ props.onValidate }
      >
        Validate
        <Icon className={`ml-3 ${classes.validatorIconSize}`} color="white" icon="it-refresh"/>
      </Button>
    </FormGroup>
    <FormGroup
      check
      className="m-3"
      tag="div"
    >
      <div className="toggles">
        <Label className="m-0 font-weight-light" check>
          Auto-refresh
          <Input type="checkbox" defaultChecked/>
          <span className="lever" />
        </Label>
      </div>
    </FormGroup>
  </div>
}