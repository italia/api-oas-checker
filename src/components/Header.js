import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from 'design-react-kit';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import { toogleMenu } from '../redux/actions.js';
import { isMenuDisplayed } from '../redux/selectors.js';

const white = 'var(--white)';
const useStyles = createUseStyles({
  version: {
    composes: 'mr-1 m-2 badge badge-pill',
    backgroundColor: white,
    color: 'var(--primary)',
  },
  icon: {
    fontSize: '1.5rem',
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
  const showMenu = useSelector((state) => isMenuDisplayed(state));
  const dispatch = useDispatch();
  const leftSection = cx(
    {
      'col-lg-2 col-xxl-1': showMenu,
      'col-lg-1 col-xxl-1': !showMenu,
      'bg-white': showMenu,
    },
    'd-flex',
    'align-items-center',
    'p-3',
    classes.animate
  );

  const rightSection = cx(
    {
      'col-lg-10 col-xxl-11': showMenu,
      'col-lg-11 col-xxl-11': !showMenu,
    },
    'd-flex',
    'justify-content-center',
    'justify-content-lg-start',
    'align-items-center',
    'py-3',
    classes.animate
  );

  const iconClassNames = cx(
    {
      'icon-white': !showMenu,
      'icon-primary': showMenu,
    },
    'ml-4',
    classes.icon
  );

  return (
    <header data-testid="header">
      <div className="container-fluid p-0 user-select-none">
        <div className={`row no-gutters bg-primary text-white`}>
          <div className={leftSection}>
            <Icon
              onClick={() => dispatch(toogleMenu())}
              role="button"
              className={iconClassNames}
              icon="it-burger"
              data-testid={'toogle-menu-icon'}
            />
          </div>
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
              Repo + Guida
            </a>
            <Icon color="white" className="p-2 d-none d-md-block" icon="it-github" size="lg" />
          </div>
        </div>
      </div>
    </header>
  );
};
