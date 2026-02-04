import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '../test-utils.js';
import {RightSection} from './RightSection';

jest.mock('design-react-kit', () => ({
  Icon: () => <div data-testid="icon" />,
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}), { virtual: true });

jest.mock('./ValidationController', () => ({ ValidationController: () => <div data-testid="validation-controller" /> }));
jest.mock('./ValidationSummary', () => ({ ValidationSummary: () => <div data-testid="validation-summary" /> }));
jest.mock('./ValidationResults', () => ({ ValidationResults: () => <div data-testid="validation-results" /> }));
jest.mock('./RulesetSelect', () => ({ RulesetSelect: () => <div data-testid="ruleset-select" /> }));
jest.mock('./LoadOpenAPISection', () => ({ LoadOpenAPISection: () => <div data-testid="load-openapi-section" /> }));
jest.mock('./CheckAPISection', () => ({ CheckAPISection: () => <div data-testid="check-api-section" /> }));
jest.mock('./PrettifySection', () => ({ PrettifySection: () => <div data-testid="prettify-section" /> }));
jest.mock('./APICanvasSection', () => ({ APICanvasSection: () => <div data-testid="api-canvas-section" /> }));
jest.mock('./APISchemaSection', () => ({ APISchemaSection: () => <div data-testid="api-schema-section" /> }));
jest.mock('./ExportSection', () => ({ ExportSection: () => <div data-testid="export-section" /> }));

describe('RightSection', () => {
  it('renders the first tab by default', () => {
    render(<RightSection />, {
      initialState: {
        validationState: {
          results: [],
        },
      },
    });

    expect(screen.getByText('Checker Configuration')).toHaveClass('active');
    expect(screen.getByTestId('load-openapi-section')).toBeInTheDocument();
    expect(screen.queryByTestId('validation-results')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prettify-section')).not.toBeInTheDocument();
  });

  it('switches to the Validation Results tab', () => {
    render(<RightSection />, {
      initialState: {
        validationState: {
          results: [{}],
        },
      },
    });

    fireEvent.click(screen.getByText(/Validation Results/));

    expect(screen.getByText(/Validation Results/)).toHaveClass('active');
    expect(screen.queryByTestId('load-openapi-section')).not.toBeInTheDocument();
    expect(screen.getByTestId('validation-results')).toBeInTheDocument();
  });

  it('switches to the Tools tab', () => {
    render(<RightSection />, {
      initialState: {
        validationState: {
          results: [],
        },
      },
    });

    fireEvent.click(screen.getByText('Tools'));

    expect(screen.getByText('Tools')).toHaveClass('active');
    expect(screen.queryByTestId('load-openapi-section')).not.toBeInTheDocument();
    expect(screen.getByTestId('prettify-section')).toBeInTheDocument();
  });

  it('shows the badge with validation count', () => {
    render(<RightSection />, {
      initialState: {
        validationState: {
          results: [{}, {}, {}],
        },
      },
    });

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('3')).toHaveClass('badge');
  });

  it('does not switch to Validation Results tab when results are null', () => {
    render(<RightSection />, {
      initialState: {
        validationState: {
          results: null,
        },
      },
    });

    fireEvent.click(screen.getByText(/Validation Results/));

    expect(screen.getByText(/Validation Results/)).not.toHaveClass('active');
    expect(screen.getByTestId('load-openapi-section')).toBeInTheDocument();
  });
});
