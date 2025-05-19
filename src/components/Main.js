import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import { Spinner } from 'design-react-kit';
import { isMenuDisplayed } from '../redux/selectors.js';
import { Menu } from './Menu.js';
import { ValidationController } from './ValidationController.js';
import { ValidationSummary } from './ValidationSummary.js';
import { ValidationResults } from './ValidationResults.js';
import { RulesetSelect } from './RulesetSelect.js';
import { FilenameSection } from './FilenameSection.js';

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

export const Main = () => {
  const classes = useStyles();
  const showMenu = useSelector((state) => isMenuDisplayed(state));

  const leftSection = cx(
    {
      'col-lg-2 col-xxl-1': showMenu,
      [classes['col-0']]: !showMenu,
    },
    classes.animate
  );

  const editorSection = cx(
    {
      'col-lg-6 col-xxl-7': showMenu,
      'col-lg-8': !showMenu,
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
          <FilenameSection />
          <ValidationSummary />
          <ValidationResults />
        </section>
      </div>
    </main>
  );
};
