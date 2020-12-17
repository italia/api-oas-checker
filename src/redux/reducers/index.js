import { combineReducers } from 'redux';
import menuReducer from './menuReducer.js';
import validationReducer from './validationReducer.js';

export default combineReducers({ menuState: menuReducer, validationState: validationReducer });