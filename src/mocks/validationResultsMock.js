/* eslint-disable sonarjs/no-duplicate-string */
export const validationResultsMock = [
  {
    code: 'string-maxlength',
    description: 'test',
    message: 'Test message 1',
    path: ['components', 'parameters', 'codBanca', 'schema'],
    severity: 0,
    range: {
      start: { line: 7, character: 13 },
      end: { line: 8, character: 20 },
    },
  },
  {
    code: 'string-maxlength',
    description: 'test',
    message: 'Test message 2',
    path: ['components', 'parameters', 'codBanca', 'schema'],
    severity: 1,
    range: {
      start: { line: 17, character: 13 },
      end: { line: 20, character: 20 },
    },
  },
  {
    code: 'string-maxlength',
    description: 'test',
    message: 'Test message 3',
    path: ['components', 'parameters', 'codBanca', 'schema'],
    severity: 1,
    range: {
      start: { line: 30, character: 13 },
      end: { line: 35, character: 20 },
    },
  },
];

export const duplicatedValidationResultsMock = [
  {
    code: 'string-maxlength',
    description: 'test',
    message: 'Test message 1',
    path: ['components', 'parameters', 'codBanca', 'schema'],
    severity: 0,
    range: {
      start: { line: 7, character: 13 },
      end: { line: 8, character: 20 },
    },
  },
  {
    code: 'string-maxlength',
    description: 'test',
    message: 'Test message 1',
    path: ['components', 'parameters', 'test', 'schema'],
    severity: 1,
    range: {
      start: { line: 7, character: 13 },
      end: { line: 8, character: 20 },
    },
  },
  {
    code: 'string-maxlength',
    description: 'test',
    message: 'Test message 1',
    path: ['components', 'parameters', 'test2', 'schema'],
    severity: 1,
    range: {
      start: { line: 7, character: 13 },
      end: { line: 8, character: 20 },
    },
  },
  {
    code: 'another-code',
    description: 'test',
    message: 'Not a duplicated one',
    path: ['components', 'parameters', 'test2', 'schema'],
    severity: 1,
    range: {
      start: { line: 7, character: 13 },
      end: { line: 8, character: 20 },
    },
  },
];
