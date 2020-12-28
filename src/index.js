import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-titillium-web';
import 'typeface-roboto-mono';
import 'typeface-lora';
import './bootstrap-italia-custom.min.css';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import App from './App.js';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

if (module?.hot) {
  module.hot.accept();
}
