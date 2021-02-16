import React from 'react';

import { render, screen, fireEvent } from '../test-utils.js';
import { Header } from './Header.js';

describe('Header', () => {
  it('renders an header', () => {
    render(<Header />);
    expect(screen.queryByTestId('header')).toBeTruthy();
  });

  it('toggles menu', () => {
    render(<Header />);
    expect(screen.queryByTestId('right-section').className.includes('col-lg-10')).toBeTruthy();
    fireEvent.click(screen.queryByTestId('toogle-menu-icon'));
    expect(screen.queryByTestId('right-section').className.includes('col-lg-11')).toBeTruthy();
  });
});
