import React from 'react';

import { render, screen } from '../test-utils.js';
import validationResultsMock from '../mocks/validationResultsMock.js';
import ValidationResultItem from './ValidationResultItem.js';

describe('ValidationResultItem', () => {
  it('renders a result message', () => {
    render(<ValidationResultItem resultItem={validationResultsMock[0]} />);
    expect(screen.queryByText(new RegExp(validationResultsMock[0].message, 'i'))).toBeTruthy();
  });

  // TODO mock redux dispatch
  xit('calls focusLineDocument on result click event', () => {});
});
