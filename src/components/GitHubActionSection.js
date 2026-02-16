import React from 'react';
import {createUseStyles} from 'react-jss';
import {Icon, Button} from 'design-react-kit';

const useStyles = createUseStyles({
  container: {
    composes: 'px-4 py-3 bg-white border-bottom',
  },
});

export const GitHubActionSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <p className="mb-3 small font-weight-bold text-muted">GitHub Action</p>
      <p className="small">
        You can integrate validation into your CI/CD workflows. For more information, see the{' '}
        <a
          href="https://github.com/italia/api-oas-checker-rules/blob/main/docs/guida_developer.md"
          target="_blank"
          rel="noreferrer"
        >
          developer guide
        </a>.
      </p>
      <Button
        color="primary"
        icon
        tag="a"
        href="https://github.com/italia/api-oas-checker-rules/blob/main/docs/resources/github-action.yml"
        target="_blank"
        rel="noreferrer"
        className="justify-content-center"
      >
        <Icon icon="it-download" color="white" className="mr-2" />
        Download the GitHub Action
      </Button>
    </div>
  );
};
