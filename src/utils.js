export const ERROR = 'error';
export const WARNING = 'warning';
export const getResultType = (severity) => (severity === 0 ? ERROR : WARNING);
