import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createUseStyles } from 'react-jss';
import { Icon } from 'design-react-kit';
import { isValidationInProgress, getRuleset } from '../redux/selectors.js';
import { setRuleset } from '../redux/actions.js';
import { getDocFilename } from '../utils.mjs';

const useStyles = createUseStyles({
  select: {
    composes: 'mx-3 px-2',
    height: '50px',
    width: '70%',
    fontSize: '0.9rem',
  },
  anchor: {
    fontSize: '0.9rem',
    '&:focus': {
      boxShadow: 'none',
    },
    '&:hover': {
      color: 'var(--primary)',
    },
  },
  info: {
    composes: 'icon icon-primary mx-1',
    width: '24px',
  },
});

export const RulesetSelect = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const ruleset = useSelector((state) => getRuleset(state));
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <div className="pt-3 d-flex align-items-center bg-white">
      <select
        className={classes.select}
        disabled={validationInProgress}
        value={ruleset}
        onChange={(e) => dispatch(setRuleset(e.target.value))}
      >
        {Object.entries(FILES_DICTIONARY).map(([filePath, fileInfo]) => (
          <option
            value={filePath}
            key={filePath}
          >
            {`${fileInfo.rulesetName}`}
          </option>
        ))}
      </select>
      <a className={classes.anchor} href={getDocFilename(ruleset)} rel="noreferrer" target="_blank">
        Rules (v{RULESETS_VERSION})
      </a>
      <Icon className={classes.info} icon="it-info-circle" />
    </div>
  );
};
