import { combineReducers } from 'redux';
import menuReducer from './menuReducer.js';
import validationReducer from './validationReducer.js';
import documentReducer from './documentReducer.js';

export default combineReducers({
  menuState: menuReducer,
  validationState: validationReducer,
  documentState: documentReducer,
});
