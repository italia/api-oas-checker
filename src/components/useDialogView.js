import { useReducer } from 'react';

const initialState = {
  isDialogOpen: false,
};

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

const useDialogView = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const closeDialog = () => dispatch({ type: 'closeDialog' });
  const openDialog = () => dispatch({ type: 'openDialog' });

  return [state.isDialogOpen, closeDialog, openDialog];
};

export default useDialogView;
