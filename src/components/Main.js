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
import RulesetSelect from './RulesetSelect.js';

// Lazy load editor to gain some ms on the fcp
const Editor = React.lazy(() => import('./Editor.js'));

const useStyles = createUseStyles({
  animate: {
    transition: '0.3s ease-in-out',
  },
  fullHeight: {
    height: 'calc(100vh - 90px)',
  },
  main: {
    extend: 'fullHeight',
    composes: 'container-fluid p-0',
  },
  editor: {
    extend: 'animate',
    overflow: 'hidden',
    borderLeft: '10px solid var(--primary)',
    borderBottom: '10px solid var(--primary)',
  },
  rightSection: {
    composes: 'col-lg-4 bg-primary',
    extend: 'animate',
  },
  'col-0': {
    flex: '0 0 0%',
    maxWidth: '0%',
  },
  spinnerContainer: {
    extend: 'fullHeight',
    composes: 'd-flex align-items-center justify-content-center',
  },
});

const Main = ({ isMenuDisplayed }) => {
  const classes = useStyles();

  const leftSection = cx(
    {
      'col-lg-2 col-xxl-1': isMenuDisplayed,
      [classes['col-0']]: !isMenuDisplayed,
    },
    classes.animate
  );

  const editorSection = cx(
    {
      'col-lg-6 col-xxl-7': isMenuDisplayed,
      'col-lg-8': !isMenuDisplayed,
    },
    classes.editor
  );

  return (
    <main className={classes.main} data-testid="main">
      <div className="row no-gutters">
        <aside className={leftSection}>
          <Menu />
        </aside>
        <section className={editorSection}>
          <Suspense
            fallback={
              <div className={classes.spinnerContainer}>
                <Spinner active double small={false} tag="span" />
              </div>
            }
          >
            <Editor />
          </Suspense>
        </section>
        <section className={classes.rightSection}>
          <RulesetSelect />
          <ValidationController />
          <ValidationSummary />
          <ValidationResults />
        </section>
      </div>
    </main>
  );
};

Main.propTypes = {
  isMenuDisplayed: PropTypes.bool.isRequired,
};

export default connect((state) => ({ isMenuDisplayed: isMenuDisplayed(state) }))(Main);
