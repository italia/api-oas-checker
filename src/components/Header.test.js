import React from 'react';
import { act } from 'react-dom/test-utils';

import { render, screen, fireEvent } from '../test-utils.js';
import { Header } from './Header.js';

describe('Header', () => {
  it('renders an header', async () => {
    await act(async () => render(<Header />));
    expect(screen.queryByTestId('header')).toBeTruthy();
  });

  it('toggles menu', async () => {
    await act(async () => render(<Header />));
    expect(screen.queryByTestId('right-section').className.includes('col-lg-10')).toBeTruthy();
    fireEvent.click(screen.queryByTestId('toogle-menu-icon'));
    expect(screen.queryByTestId('right-section').className.includes('col-lg-11')).toBeTruthy();
  });
});
