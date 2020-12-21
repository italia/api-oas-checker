import React from 'react';

import { fireEvent, render, screen } from '../test-utils.js';
import validationResultsMock from '../mocks/validationResultsMock.js';
import ValidationResultItem from './ValidationResultItem.js';

describe('ValidationResultItem', () => {
  let result;
  beforeEach(() => {
    result = {
      fingerprint: validationResultsMock[0].fingerprint,
      severity: validationResultsMock[0].severity,
      line: validationResultsMock[0].range.start.line,
      character: validationResultsMock[0].range.start.character,
      message: validationResultsMock[0].message,
    };
  });

  it('renders a result message', () => {
    const onResultClick = jest.fn();
    render(<ValidationResultItem resultInfo={result} onResultClick={onResultClick} />);
    expect(screen.queryByText(new RegExp(result.message, 'i'))).toBeTruthy();
  });

  it('calls onResultClick on result click event', () => {
    const onResultClick = jest.fn();
    render(<ValidationResultItem resultInfo={result} onResultClick={onResultClick} />);
    fireEvent.click(screen.queryByTestId('validation-result-entry'));
    expect(onResultClick).toHaveBeenCalledTimes(1);
  });
});
