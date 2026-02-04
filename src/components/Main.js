import React, {Suspense} from 'react';
import cx from 'classnames';
import {createUseStyles} from 'react-jss';
import {Spinner} from 'design-react-kit';
import {RightSection} from './RightSection.js';

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
  spinnerContainer: {
    extend: 'fullHeight',
    composes: 'd-flex align-items-center justify-content-center',
  },
});

export const Main = () => {
  const classes = useStyles();

  const editorSection = cx(
    'col-lg',
    classes.editor
  );

  return (
    <main className={classes.main} data-testid="main">
      <div className="row no-gutters">
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
        <RightSection />
      </div>
    </main>
  );
};