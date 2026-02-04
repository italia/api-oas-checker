import React from 'react';
import {Icon} from 'design-react-kit';
import {createUseStyles} from 'react-jss';
import cx from 'classnames';

const white = 'var(--white)';
const useStyles = createUseStyles({
  version: {
    composes: 'mr-1 m-2 badge badge-pill',
    backgroundColor: white,
    color: 'var(--primary)',
  },
  animate: {
    transition: '0.3s ease-in-out',
  },
  anchor: {
    composes: 'm-0 ml-auto d-none d-md-block',
    color: white,
    fontSize: '0.8rem',
    '&:hover': {
      color: white,
    },
    '&:focus': {
      boxShadow: 'none',
    },
  },
});

export const Header = () => {
  const classes = useStyles();
  
  const rightSection = cx(
    'col',
    'd-flex',
    'justify-content-center',
    'justify-content-lg-start',
    'align-items-center',
    'py-3',
    classes.animate
  );

  return (
    <header data-testid="header">
      <div className="container-fluid p-0 user-select-none">
        <div className={`row no-gutters bg-primary text-white`}>
          <div data-testid="right-section" className={rightSection}>
            <img className="d-none d-md-block ml-4 mr-2" src="it.svg" alt="it logo" />
            <img className="d-none d-md-block mx-2" src="loghetto.svg" alt="checker logo" />
            <span className="m-0 font-weight-semibold">Italian OpenAPI Checker</span>
            <span href="#" className={classes.version}>
              {/* eslint-disable-next-line no-undef */}
              {VERSION}
            </span>
            {/* eslint-disable-next-line no-undef */}
            <a className={classes.anchor} href={REPO_URL}>
              Repository
            </a>
            <Icon color="white" className="p-2 d-none d-md-block" icon="it-github" size="lg" />
          </div>
        </div>
      </div>
    </header>
  );
};