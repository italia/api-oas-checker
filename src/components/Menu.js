import React from 'react';
import { Button, FormGroup } from 'design-react-kit';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDocumentText, isValidationInProgress } from '../redux/selectors.js';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  button: {
    whiteSpace: 'nowrap', // required for better menu animation
  },
});

// eslint-disable-next-line no-unused-vars
const Menu = ({ disabled, documentText }) => {
  const classes = useStyles();
  const buttonCx = `${classes.button} py-2 px-3`;
  return (
    <>
      <div className="border-top" data-testid="menu">
        <FormGroup className="m-4" tag="div">
          <Button className={buttonCx} color="primary" disabled={disabled} icon tag="button">
            Save results
          </Button>
        </FormGroup>
        <FormGroup className="m-4" tag="div">
          <Button className={buttonCx} color="primary" disabled={disabled} icon tag="button">
            Export results
          </Button>
        </FormGroup>
      </div>
      <div className="border-top">
        <FormGroup className="m-4" tag="div">
          <Button className={buttonCx} color="primary" disabled={disabled} icon tag="button">
            Upload file
          </Button>
        </FormGroup>
        <FormGroup className="m-4" tag="div">
          <Button className={buttonCx} color="primary" disabled={disabled} icon tag="button">
            From url
          </Button>
        </FormGroup>
        <FormGroup className="m-4" tag="div">
          <Button className={buttonCx} color="primary" disabled={disabled} icon tag="button">
            Template
          </Button>
        </FormGroup>
      </div>
      <div className="border-top">
        <FormGroup className="m-4" tag="div">
          <Button className={buttonCx} color="primary" disabled={disabled} icon tag="button">
            Settings
          </Button>
        </FormGroup>
      </div>
    </>
  );
};

Menu.propTypes = {
  disabled: PropTypes.bool.isRequired,
  documentText: PropTypes.string.isRequired,
};

export default connect((state) => ({
  disabled: isValidationInProgress(state),
  documentText: getDocumentText(state),
}))(Menu);
