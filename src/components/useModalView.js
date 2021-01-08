import { useReducer } from 'react';

const initialState = {
  isModalOpen: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'openModal':
      return { ...state, isModalOpen: true };
    case 'closeModal':
      return { ...state, isModalOpen: false };
    default:
      return state;
  }
};

const useModalView = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const closeModal = () => dispatch({ type: 'closeModal' });
  const openModal = () => dispatch({ type: 'openModal' });

  return [state.isModalOpen, closeModal, openModal];
};

export default useModalView;
