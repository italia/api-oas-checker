import React from 'react';
import { act } from 'react-dom/test-utils';

import { render, screen } from '../test-utils.js';
import { Menu } from './Menu.js';

describe('menu', () => {
  it('renders Menu', async () => {
    await act(async () => render(<Menu />));
    expect(screen.queryByTestId('menu')).toBeTruthy();
  });

  it('should be disabled when a validation is in progress', async () => {
    await act(async () =>
      render(<Menu />, {
        initialState: { validationState: { inProgress: true, ruleset: DEFAULT_RULESET } },
      })
    );
    const buttons = screen.queryAllByRole('button');
    expect(buttons.every((y) => y.className.includes('disabled'))).toBeTruthy();
  });
});
