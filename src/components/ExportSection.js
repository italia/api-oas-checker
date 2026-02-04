import React from 'react';
import {createUseStyles} from 'react-jss';
import {useSelector} from 'react-redux';
import {getValidationResults} from '../redux/selectors.js';
import {ExportResultsButton} from './ExportResultsButton.js';
import {SaveFileButton} from './SaveFileButton.js';

const useStyles = createUseStyles({
  container: {
    composes: 'px-4 py-3 bg-white border-bottom',
  },
});

export const ExportSection = () => {
  const validationResults = useSelector(getValidationResults);
  const classes = useStyles();

  if (validationResults === null) {
    return null;
  }

  return (
    <div className={classes.container}>
      <p className="mb-3 small font-weight-bold text-muted">5. Save and Export</p>
      <SaveFileButton className="py-2 px-3 justify-content-center" />
      {validationResults.length > 0 && (
        <ExportResultsButton className="ml-3 py-2 px-3 justify-content-center" />
      )}
    </div>
  );
};
