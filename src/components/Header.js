import React from 'react';
import { connect } from 'react-redux';
import { Badge, Icon } from 'design-react-kit';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { toogleMenu } from '../redux/actions.js';

const useStyles = createUseStyles({
  version: {
    backgroundColor: 'var(--white)',
    color: 'var(--primary)'
  },
  icon: {
    fontSize: '1.5rem'
  }
});

const Header = ({ showMenu, toogleMenu }) => {
  const classes = useStyles();
  const leftSection = classNames({
      'col-sm-2': showMenu,
      'col-sm-1': !showMenu,
      'bg-white': showMenu,
    }, 'd-flex', 'align-items-center', 'p-3');

  const rightSection = classNames({
    'col-sm-10': showMenu,
    'col-sm-11': !showMenu
  }, 'd-flex', 'justify-content-start', 'align-items-center', 'py-3');

  const iconClassNames = classNames({
    'icon-white': !showMenu,
    'icon-primary': showMenu
  }, 'ml-4', classes.icon);

  return <header>
    <div className="container-fluid p-0 user-select-none">
        <div className={`row no-gutters bg-primary text-white`}>
          <div className={leftSection}>
            <Icon onClick={toogleMenu} role='button' className={iconClassNames} icon="it-burger"/>
          </div>
          <div className={rightSection}>
            <img className="ml-4 mr-2" src='it.svg' alt='it logo' />
            <img className="mx-2" src='loghetto.svg' alt='checker logo' />
            <h5 className="m-0">Italian OpenAPI Validation Checker</h5>
            <Badge
              className={`mr-1 m-2 ${classes.version}`}
              color={'primary'}
              pill
              href="#"
              tag="span"
            >
              {/*TODO: webpack plugin provider. Get info from the package json*/}
              Beta 0.2
            </Badge>
            <h6 className="m-0 ml-auto">Info + Repo</h6>
            <Icon color="white" className="p-2" icon="it-github" size="lg" />
          </div>
        </div>
      </div>
  </header>
}

export default connect(state => ({ showMenu: state.menuState.showMenu }), { toogleMenu })(Header);