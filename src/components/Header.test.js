import React from "react";

import Header from './Header.js'
import { render, screen, fireEvent } from '../test-utils.js';

describe('header', () => {
  it('renders Header', () => {
    render(<Header />);
    expect(screen.queryByTestId('header')).toBeTruthy();
  });

  it('toggles menu', () => {
    render(<Header />);
    expect(screen.queryByTestId('right-section').className.includes('col-sm-10')).toBeTruthy();
    fireEvent.click(screen.queryByTestId('toogle-menu-icon'));
    expect(screen.queryByTestId('right-section').className.includes('col-sm-11')).toBeTruthy();
  });
})