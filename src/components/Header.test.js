import React from 'react';

import Header from './Header.js';
import { render, screen, fireEvent } from '../test-utils.js';

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
