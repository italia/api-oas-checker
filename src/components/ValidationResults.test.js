import React from "react";

import { fireEvent, render, screen } from '../test-utils.js';
import ValidationResults from './ValidationResults.js';
import validationResultsMock from '../mocks/validationResultsMock.js';

describe('validation results', () => {
  const onResultClick = jest.fn();

  it(`doesn't render nothing on init`, () => {
    render(<ValidationResults onResultClick={onResultClick} />);
    expect(screen.queryByTestId('validation-results-header')).toBeNull();
    expect(screen.queryAllByTestId('validation-results-entry').length).toBe(0);
  });

  it(`renders results on validation end`, () => {
    render(<ValidationResults onResultClick={onResultClick} />, {
      initialState: {
        validationState: {
          results: validationResultsMock
        }
      }
    });
    expect(screen.queryAllByTestId('validation-result-entry').length).toBe(3);
  });

  it('calls on result click function', () => {
    const onResultClick = jest.fn();
    render(<ValidationResults onResultClick={onResultClick} />, {
      initialState: {
        validationState: {
          results: validationResultsMock
        }
      }
    });
    fireEvent.click(screen.queryAllByTestId('validation-result-entry')[0]);
    expect(onResultClick).toHaveBeenCalledTimes(1);
  });
})