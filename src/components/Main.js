import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import { Spinner } from 'design-react-kit';
import Menu from './Menu.js';
import ValidationController from './ValidationController.js';
import ValidationSummary from './ValidationSummary.js';
import ValidationResults from './ValidationResults.js';
import { isMenuDisplayed } from '../redux/selectors.js';

// Lazy load editor to gain some ms on the fcp
const Editor = React.lazy(() => import('./Editor.js'));

const useStyles = createUseStyles({
  animate: {
    transition: '0.3s ease-in-out',
  },
  main: {
    composes: 'container-fluid p-0',
    height: 'calc(100vh - 90px)',
  },
  editor: {
    extend: 'animate',
    borderLeft: '10px solid var(--primary)',
  },
  footer: {
    extend: 'animate',
    marginLeft: 'auto',
    minHeight: '10px',
    maxHeight: '10px',
    backgroundColor: 'var(--primary)',
  },
  'col-0': {
    flex: '0 0 0%',
    maxWidth: '0%',
  },
});

const Main = ({ isMenuDisplayed }) => {
  const classes = useStyles();

  const sideSection = cx(
    {
      'col-md-2 col-xxl-1': isMenuDisplayed,
      [classes['col-0']]: !isMenuDisplayed,
    },
    classes.animate
  );

  const editorSection = cx(
    {
      'col-md-6 col-xxl-7': isMenuDisplayed,
      'col-md-8': !isMenuDisplayed,
    },
    classes.editor
  );

  const footer = cx(
    {
      'col-md-10 col-xxl-11': isMenuDisplayed,
      'col-md-12': !isMenuDisplayed,
    },
    classes.footer
  );

  return (
    <main className={classes.main} data-testid="main">
      <div className="row no-gutters">
        <aside className={sideSection}>
          <Menu />
        </aside>
        <section className={editorSection}>
          <Suspense
            fallback={
              <div className="d-flex h-100 align-items-center justify-content-center">
                <Spinner active double small={false} tag="span" />
              </div>
            }
          >
            <Editor />
          </Suspense>
        </section>
        <section className="col-md-4">
          <ValidationController />
          <ValidationSummary />
          <ValidationResults />
        </section>
      </div>
      <div className="row no-gutters">
        <footer className={footer}></footer>
      </div>
    </main>
  );
};

Main.propTypes = {
  isMenuDisplayed: PropTypes.bool.isRequired,
};

export default connect((state) => ({ isMenuDisplayed: isMenuDisplayed(state) }))(Main);
