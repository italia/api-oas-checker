import React from "react";

import Menu from './Menu.js'
import { render, screen } from '../test-utils.js';

describe('menu', () => {
  it('renders Menu', () => {
    render(<Menu />);
    expect(screen.queryByTestId('menu')).toBeTruthy();
  });

  it('should be disabled when a validation is in progress', () => {
    render(<Menu />, { initialState: { validationState: { inProgress: true } } });
    const buttons = screen.queryAllByRole('button');
    expect(buttons.every(y => y.className.includes('disabled'))).toBeTruthy();
  });
})