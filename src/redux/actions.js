import { SET_VALIDATION_RESULTS, TOOGLE_MENU, SET_VALIDATION_IN_PROGRESS } from './actionTypes.js';

export const toogleMenu = () => ({
  type: TOOGLE_MENU
});

export const setValidationResults = results => ({
  type: SET_VALIDATION_RESULTS,
  results
});

export const setValidationInProgress = inProgress => ({
  type: SET_VALIDATION_IN_PROGRESS,
  inProgress
});