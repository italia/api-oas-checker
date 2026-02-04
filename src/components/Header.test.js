import React from 'react';
import {act} from 'react-dom/test-utils';

import {render, screen} from '../test-utils.js';
import {Header} from './Header.js';

describe('Header', () => {
  it('renders an header', async () => {
    await act(async () => render(<Header />));
    expect(screen.queryByTestId('header')).toBeTruthy();
  });
});
