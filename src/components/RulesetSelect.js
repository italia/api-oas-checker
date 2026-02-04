import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createUseStyles} from 'react-jss';
import {Icon} from 'design-react-kit';
import {getRuleset, isValidationInProgress} from '../redux/selectors.js';
import {setRuleset} from '../redux/actions.js';

const useStyles = createUseStyles({
    select: {
        height: '50px',
        width: '100%',
        fontSize: '0.9rem',
        display: 'block',
        marginBottom: '0.5rem',
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
    version: {
        display: 'block',
        fontSize: '0.9rem',
        width: '100%',
        color: 'var(--primary)',
        marginBottom: '0rem'
    },
});

export const RulesetSelect = () => {
    const validationInProgress = useSelector((state) => isValidationInProgress(state));
    const ruleset = useSelector((state) => getRuleset(state));
    const dispatch = useDispatch();
    const classes = useStyles();
    return (
        <div className="px-4 py-3 bg-white d-flex flex-column border-bottom">
            <p className="mb-2 small font-weight-bold text-muted">Step 2. Choose a ruleset</p>
            <select
                className={classes.select}
                disabled={validationInProgress}
                value={ruleset}
                onChange={(e) => dispatch(setRuleset(e.target.value))}
            >
                {Object.entries(FILES_DICTIONARY).map(([filePath, fileInfo]) => (
                    <option value={filePath} key={filePath}>
                        {`${fileInfo.rulesetName}`}
                    </option>
                ))}
            </select>
            <p className={classes.version}>
                <Icon className={classes.info} icon="it-info-circle"/> Current Ruleset Bundle: {RULESETS_VERSION}
            </p>
        </div>
    );
};
