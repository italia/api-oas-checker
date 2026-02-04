import React from 'react';
import {FormGroup, Icon, Input, Label} from 'design-react-kit';
import {UncontrolledTooltip} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import {getAutoRefresh, getOnlyErrors, isValidationInProgress} from '../redux/selectors.js';
import {setAutoRefresh, setOnlyErrors} from '../redux/actions.js';

/**
 * Component for Step 3: Configuring validation options.
 * Allows toggling auto-refresh and only-errors filter.
 */
export const ValidationController = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const onlyErrors = useSelector((state) => getOnlyErrors(state));
  const autoRefresh = useSelector((state) => getAutoRefresh(state));
  const dispatch = useDispatch();

  return (
    <div className="px-4 py-3 bg-white border-bottom">
      <p className="mb-3 small font-weight-bold text-muted">Step 3. Options</p>
      <div className="row align-items-center no-gutters">
        <div className="col-6 d-flex">
          <FormGroup check className="m-0" tag="div">
            <div data-testid="auto-refresh" className="toggles m-0">
              <Label className="m-0 d-flex align-items-center" check style={{ cursor: 'pointer' }}>
                <Input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={() => dispatch(setAutoRefresh(!autoRefresh))}
                  disabled={validationInProgress}
                />
                <span className="lever m-0" />
                <span className="ml-2 font-weight-light" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  Auto-refresh
                </span>
                <Icon
                  icon="it-info-circle"
                  size="xs"
                  id="auto-refresh-info"
                  className="ml-1"
                  style={{ cursor: 'pointer' }}
                />
                <UncontrolledTooltip placement="top" target="auto-refresh-info">
                  Automatically triggers validation when changes are detected in the editor.
                </UncontrolledTooltip>
              </Label>
            </div>
          </FormGroup>
        </div>
        <div className="col-6 d-flex">
          <FormGroup check className="m-0" tag="div">
            <div data-testid="only-errors" className="toggles m-0">
              <Label className="m-0 d-flex align-items-center" check style={{ cursor: 'pointer' }}>
                <Input
                  type="checkbox"
                  checked={onlyErrors}
                  onChange={() => dispatch(setOnlyErrors(!onlyErrors))}
                  disabled={validationInProgress}
                />
                <span className="lever m-0" />
                <span className="ml-2 font-weight-light" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  Only-errors
                </span>
              </Label>
            </div>
          </FormGroup>
        </div>
      </div>
    </div>
  );
};
