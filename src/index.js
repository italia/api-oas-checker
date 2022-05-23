import React from 'react';
import ReactDOM from 'react-dom/client';
import 'typeface-titillium-web';
import 'typeface-roboto-mono';
import 'typeface-lora';
import './scss/bootstrap-italia-custom.scss';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

if (module?.hot) {
  module.hot.accept();
}
