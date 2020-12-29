import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'design-react-kit';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import { toogleMenu } from '../redux/actions.js';
import { isMenuDisplayed } from '../redux/selectors.js';
import PropTypes from 'prop-types';

const useStyles = createUseStyles({
  version: {
    composes: 'mr-1 m-2 badge badge-pill',
    backgroundColor: 'var(--white)',
    color: 'var(--primary)',
  },
  icon: {
    fontSize: '1.5rem',
  },
  animate: {
    transition: '0.3s ease-in-out',
  },
  anchor: {
    composes: 'm-0 ml-auto',
    color: 'var(--white)',
    fontSize: '0.8rem',
    '&:hover': {
      color: 'var(--white)',
    },
    '&:focus': {
      boxShadow: 'none',
    },
  },
});

const Header = ({ isMenuDisplayed, toogleMenu }) => {
  const classes = useStyles();
  const leftSection = cx(
    {
      'col-md-2 col-xxl-1': isMenuDisplayed,
      'col-md-1 col-xxl-1': !isMenuDisplayed,
      'bg-white': isMenuDisplayed,
    },
    'd-flex',
    'align-items-center',
    'p-3',
    classes.animate
  );

  const rightSection = cx(
    {
      'col-md-10 col-xxl-11': isMenuDisplayed,
      'col-md-11 col-xxl-11': !isMenuDisplayed,
    },
    'd-flex',
    'justify-content-start',
    'align-items-center',
    'py-3',
    classes.animate
  );

  const iconClassNames = cx(
    {
      'icon-white': !isMenuDisplayed,
      'icon-primary': isMenuDisplayed,
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
              onClick={toogleMenu}
              role="button"
              className={iconClassNames}
              icon="it-burger"
              data-testid={'toogle-menu-icon'}
            />
          </div>
          <div data-testid="right-section" className={rightSection}>
            <img className="ml-4 mr-2" src="it.svg" alt="it logo" />
            <img className="mx-2" src="loghetto.svg" alt="checker logo" />
            <span className="m-0 font-weight-semibold">Italian OpenAPI Validation Checker</span>
            <span href="#" className={classes.version}>
              {/* eslint-disable-next-line no-undef */}
              Beta {VERSION}
            </span>
            {/* eslint-disable-next-line no-undef */}
            <a className={classes.anchor} href={REPO_URL}>
              Info + Repo
            </a>
            <Icon color="white" className="p-2" icon="it-github" size="lg" />
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  isMenuDisplayed: PropTypes.bool.isRequired,
  toogleMenu: PropTypes.func.isRequired,
};

export default connect((state) => ({ isMenuDisplayed: isMenuDisplayed(state) }), { toogleMenu })(Header);
