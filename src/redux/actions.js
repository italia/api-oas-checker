import { SET_VALIDATION_RESULTS, TOOGLE_MENU, SET_VALIDATION_IN_PROGRESS } from './actionTypes.js';

export const toogleMenu = () => ({
  type: TOOGLE_MENU,
  payload: {}
});

export const setValidationResults = results => ({
  type: SET_VALIDATION_RESULTS,
  payload: results
});

export const setValidationInProgress = validationInProgress => ({
  type: SET_VALIDATION_IN_PROGRESS,
  payload: validationInProgress
});