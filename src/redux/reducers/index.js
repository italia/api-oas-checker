import { combineReducers } from 'redux';
import showMenu from './showMenu.js';
import validationResults from './validationResults.js';
import validationInProgress from './validationInProgress.js';

export default combineReducers({ showMenu, validationResults, validationInProgress });