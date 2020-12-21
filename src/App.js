import React from 'react';
import Header from './components/Header.js';
import Main from './components/Main.js';
import { createUseStyles } from 'react-jss';
const rootStyles = createUseStyles({
  '@global': {
    ':root': {
      '--danger': '#db0026',
      '--danger-hover': '#fdf2f4',
      '--warning': '#ffB600',
      '--warning-text-dark': '#33485c',
      '--warning-hover': '#ffb6000d',
    },
  },
});

const App = () => {
  rootStyles();
  return (
    <>
      <Header />
      <Main />
    </>
  );
};

export default App;
