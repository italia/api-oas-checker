import React from 'react';

import { render, screen, fireEvent } from '../test-utils.js';
import ValidationController from './ValidationController.js';

describe('validation controller', () => {
  // TODO mock redux dispatch
  xit('calls on validate function', () => {
    const onValidateMock = jest.fn();
    render(<ValidationController onValidate={onValidateMock} />);
    fireEvent.click(screen.queryByTestId('validation-button'));
    expect(onValidateMock).toHaveBeenCalledTimes(1);
  });

  it('display please wait', () => {
    render(<ValidationController />, {
      initialState: {
        validationState: {
          inProgress: true,
        },
      },
    });
    expect(screen.queryByTestId('validation-button').textContent.includes('Please wait')).toBeTruthy();
    expect(screen.queryByTestId('auto-refresh')).toBeNull();
  });
});
