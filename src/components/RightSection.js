import React, {useState} from 'react';
import {createUseStyles} from 'react-jss';
import {useSelector} from 'react-redux';
import {Icon} from 'design-react-kit';
import {ValidationController} from './ValidationController.js';
import {ValidationSummary} from './ValidationSummary.js';
import {ValidationResults} from './ValidationResults.js';
import {RulesetSelect} from './RulesetSelect.js';
import {LoadOpenAPISection} from './LoadOpenAPISection.js';
import {CheckAPISection} from './CheckAPISection.js';
import {PrettifySection} from './PrettifySection';
import {APICanvasSection} from './APICanvasSection.js';
import {APISchemaSection} from './APISchemaSection.js';
import {ExportSection} from './ExportSection.js';
import {getValidationResults} from '../redux/selectors.js';
import {ERROR, WARNING} from '../utils.mjs';
import {getValidationResultType} from '../spectral/spectral_utils.js';

const useStyles = createUseStyles({
  animate: {
    transition: '0.3s ease-in-out',
  },
  rightSection: {
    composes: 'col-lg-4 bg-primary',
    extend: 'animate',
  },
});

export const RightSection = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const validationResults = useSelector(getValidationResults);
  const validationCount = validationResults ? validationResults.length : 0;

  const getBadgeColor = () => {
    if (validationCount === 0) return 'bg-success';
    const hasError = validationResults.some((r) => getValidationResultType(r.severity) === ERROR);
    if (hasError) return 'bg-danger';
    const hasWarning = validationResults.some((r) => getValidationResultType(r.severity) === WARNING);
    if (hasWarning) return 'bg-warning';
    return 'bg-secondary';
  };

  return (
    <section className={classes.rightSection}>
      <ul className="nav nav-tabs auto">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveTab(0)}
            type="button"
          >
            Checker Configuration
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 1 ? 'active' : ''} ${
              validationResults === null || validationCount === 0 ? 'disabled' : ''
            }`}
            onClick={() => validationResults !== null && validationCount > 0 && setActiveTab(1)}
            type="button"
            disabled={validationResults === null || validationCount === 0}
          >
            Validation Results
            {validationResults !== null && (
              <span className={`ml-2 badge text-white ${getBadgeColor()}`}>
                {validationCount === 0 ? <Icon icon="it-check" color="white" size="xs" /> : validationCount}
              </span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => setActiveTab(2)}
            type="button"
          >
            Tools
          </button>
        </li>
      </ul>
      {activeTab === 0 && (
        <div>
          <LoadOpenAPISection />
          <RulesetSelect />
          <ValidationController />
          <CheckAPISection />
          <ValidationSummary onSeeDetails={() => setActiveTab(1)} />
          <ExportSection />
        </div>
      )}
      {activeTab === 1 && (
        <div>
          <ValidationResults />
        </div>
      )}
      {activeTab === 2 && (
        <div>
          <PrettifySection />
          <APICanvasSection />
          <APISchemaSection />
        </div>
      )}
    </section>
  );
};
