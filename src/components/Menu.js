import React from 'react';
import { createUseStyles } from 'react-jss';
import { LoadFromUrlButton } from './LoadFromUrlButton.js';
import { UploadFileButton } from './UploadFileButton.js';
import { ExportResultsButton } from './ExportResultsButton.js';
import { SaveFileButton } from './SaveFileButton.js';
import { ShowButton } from './ShowButton.js';

const useStyles = createUseStyles({
  buttonContainer: {
    composes: 'm-4 pl-3',
    '& button': {
      padding: '8px 16px',
      width: '100%',
    },
    // TODO: remove duplication
    '& label': {
      padding: '8px 16px',
      width: '100%',
      marginBottom: 0,
    },
  },
});

export const Menu = () => {
  const classes = useStyles();

  return (
    <>
      <section className="border-top" data-testid="menu">
        <div className={classes.buttonContainer}>
          <SaveFileButton />
        </div>
        <div className={classes.buttonContainer}>
          <ExportResultsButton />
        </div>
        <div className={classes.buttonContainer}>
          <ShowButton />
        </div>
      </section>
      <section className="border-top">
        <div className={classes.buttonContainer}>
          <UploadFileButton />
        </div>
        <div className={classes.buttonContainer}>
          <LoadFromUrlButton />
        </div>
      </section>
    </>
  );
};
