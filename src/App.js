import React from 'react';
import {NotificationManager} from 'design-react-kit';
import {Header} from './components/Header.js';
import {Main} from './components/Main.js';

const App = () => (
  <>
    <Header />
    <Main />
    <NotificationManager />
  </>
);

export default App;
