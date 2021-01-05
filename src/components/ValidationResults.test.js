import React from 'react';

import { render, screen } from '../test-utils.js';
import ValidationResults from './ValidationResults.js';
import { validationResultsMock } from '../mocks/validationResultsMock.js';

describe('ValidationResults', () => {
  it(`doesn't render nothing on init`, () => {
    render(<ValidationResults />);
    expect(screen.queryByTestId('validation-results-header')).toBeNull();
    expect(screen.queryAllByTestId('validation-results-entry').length).toBe(0);
  });

  it(`doesn't render nothing on zero problems`, () => {
    render(<ValidationResults />, {
      initialState: {
        validationState: {
          results: [],
          ruleset: 'test',
        },
      },
    });
    expect(screen.queryByTestId('validation-results-header')).toBeNull();
    expect(screen.queryAllByTestId('validation-results-entry').length).toBe(0);
  });

  it(`renders results on validation end`, () => {
    render(<ValidationResults />, {
      initialState: {
        validationState: {
          results: validationResultsMock,
          ruleset: 'test',
        },
      },
    });
    expect(screen.queryAllByTestId('validation-result-entry').length).toBe(3);
  });
});
