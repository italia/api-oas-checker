import React from 'react';
import { act } from 'react-dom/test-utils';

import { render, screen } from '../test-utils.js';
import { validationResultsMock } from '../mocks/validationResultsMock.js';
import { ValidationResults } from './ValidationResults.js';

describe('ValidationResults', () => {
  it(`doesn't render nothing on init`, async () => {
    await act(async () => render(<ValidationResults />));
    expect(screen.queryByTestId('validation-results-header')).toBeNull();
    expect(screen.queryAllByTestId('validation-results-entry').length).toBe(0);
  });

  it(`doesn't render nothing on zero problems`, async () => {
    await act(async () =>
      render(<ValidationResults />, {
        initialState: {
          validationState: {
            results: [],
          },
        },
      })
    );
    expect(screen.queryByTestId('validation-results-header')).toBeNull();
    expect(screen.queryAllByTestId('validation-results-entry').length).toBe(0);
  });

  it(`renders results on validation end`, async () => {
    await act(async () =>
      render(<ValidationResults />, {
        initialState: {
          validationState: {
            results: validationResultsMock,
          },
        },
      })
    );
    expect(screen.queryAllByTestId('validation-result-entry').length).toBe(3);
  });
});
