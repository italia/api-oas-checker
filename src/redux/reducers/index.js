import {combineReducers} from 'redux';
import validationReducer from './validationReducer.js';
import documentReducer from './documentReducer.js';

export default combineReducers({
  validationState: validationReducer,
  documentState: documentReducer,
});
