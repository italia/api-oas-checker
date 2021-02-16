import React from 'react';

import { render, screen } from '../test-utils.js';
import { validationResultsMock } from '../mocks/validationResultsMock.js';
import { ValidationSummary } from './ValidationSummary.js';

describe('ValidationSummary', () => {
  it('renders a validation summary', () => {
    render(<ValidationSummary />, {
      initialState: {
        validationState: {
          results: validationResultsMock,
        },
      },
    });
    expect(screen.queryByTestId('errors-badge').textContent.includes('1')).toBeTruthy();
    expect(screen.queryByTestId('warnings-badge').textContent.includes('2')).toBeTruthy();
  });
});
