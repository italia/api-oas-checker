import React from 'react';
import { act } from 'react-dom/test-utils';

import { render, screen } from '../test-utils.js';
import { validationResultsMock } from '../mocks/validationResultsMock.js';
import { ValidationResultItem } from './ValidationResultItem.js';

describe('ValidationResultItem', () => {
  it('renders a result message', async () => {
    await act(async () => render(<ValidationResultItem resultItem={validationResultsMock[0]} />));
    expect(screen.queryByText(new RegExp(validationResultsMock[0].message, 'i'))).toBeTruthy();
  });

  // TODO mock redux dispatch
  xit('calls focusLineDocument on result click event', () => {});
});
