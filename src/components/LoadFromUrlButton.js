import React, { useCallback, useReducer } from 'react';
import { Button, Input } from 'design-react-kit';
import Dialog from './Dialog.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setDocumentUrl } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';

const initialState = {
  isDialogOpen: false,
  url: null,
};

// TODO: remove duplicate code
const reducer = (state, action) => {
  switch (action.type) {
    case 'openDialog':
      return { ...state, isDialogOpen: true };
    case 'closeDialog':
      return { ...state, isDialogOpen: false };
    case 'setUrl':
      return { ...state, url: action.url };
    default:
      return state;
  }
};

const LoadFromUrlButton = ({ isValidationInProgress, className, setDocumentUrl }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const closeDialog = useCallback(() => {
    dispatch({ type: 'closeDialog' });
  }, [dispatch]);
  const openDialog = useCallback(() => {
    dispatch({ type: 'openDialog' });
  }, [dispatch]);
  const handleConfirmAction = useCallback(() => {
    setDocumentUrl(state.url);
    closeDialog();
  }, [state.url, setDocumentUrl]);

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
        From url
      </Button>

      <Dialog
        isOpen={state.isDialogOpen}
        title="Load from url"
        labelCloseAction="Close"
        labelConfirmAction="Load url"
        renderBody={() => (
          <Input
            label="Url"
            type="text"
            value={state.url}
            onChange={(e) => dispatch({ type: 'setUrl', url: e.target.value })}
          />
        )}
        onCloseAction={closeDialog}
        onConfirmAction={handleConfirmAction}
      />
    </>
  );
};

LoadFromUrlButton.propTypes = {
  className: PropTypes.string.isRequired,
  isValidationInProgress: PropTypes.bool.isRequired,
  setDocumentUrl: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    isValidationInProgress: isValidationInProgress(state),
  }),
  {
    setDocumentUrl,
  }
)(LoadFromUrlButton);
