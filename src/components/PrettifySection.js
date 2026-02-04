import {PrettifyButton} from './PrettifyButton';
import React from 'react';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles({
  container: {
    composes: 'px-4 py-3 bg-white border-bottom',
  },
});

export const PrettifySection = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <p className="mb-3 small font-weight-bold text-muted">Prettify your OpenAPI interface</p>
      <p className="small">
        Use this tool to automatically format your OpenAPI document. It works with both JSON and YAML formats, ensuring your code is clean and readable.
      </p>
      <PrettifyButton />
    </div>
  );
};