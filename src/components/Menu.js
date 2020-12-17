import React from 'react';
import { Button, FormGroup } from 'design-react-kit';
import { connect } from 'react-redux';

const Menu = ({ disabled }) => <>
  <div className="border-top">
    <FormGroup
      className="m-4"
      tag="div"
    >
      <Button
        className="py-2 px-3"
        color="primary"
        disabled={disabled}
        icon
        tag="button"
      >
        Save results
      </Button>
    </FormGroup>
    <FormGroup
      className="m-4"
      tag="div"
    >
      <Button
        className="py-2 px-3"
        color="primary"
        disabled={disabled}
        icon
        tag="button"
      >
        Export results
      </Button>
    </FormGroup>
  </div>
  <div className="border-top">
    <FormGroup
      className="m-4"
      tag="div"
    >
      <Button
        className="py-2 px-3"
        color="primary"
        disabled={disabled}
        icon
        tag="button"
      >
        Upload file
      </Button>
    </FormGroup>
    <FormGroup
      className="m-4"
      tag="div"
    >
      <Button
        className="py-2 px-3"
        color="primary"
        disabled={disabled}
        icon
        tag="button"
      >
        From url
      </Button>
    </FormGroup>
    <FormGroup
      className="m-4"
      tag="div"
    >
      <Button
        className="py-2 px-3"
        color="primary"
        disabled={disabled}
        icon
        tag="button"
      >
        Template
      </Button>
    </FormGroup>
  </div>
  <div className="border-top">
    <FormGroup
      className="m-4"
      tag="div"
    >
      <Button
        className="py-2 px-3"
        color="primary"
        disabled={disabled}
        icon
        tag="button"
      >
        Settings
      </Button>
    </FormGroup>
  </div>
</>

export default connect(state => ({ disabled: state.validationInProgress }))(Menu)