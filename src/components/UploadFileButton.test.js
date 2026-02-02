import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '../test-utils.js';
import { UploadFileButton } from './UploadFileButton.js';

describe('UploadFileButton', () => {
  it('renders with correct accept attribute', () => {
    render(<UploadFileButton />);
    const fileInput = screen.getByLabelText(/Upload file/i);
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('accept', '.yaml, .yml, .json');
  });
});
