import React, { useCallback, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Icon } from 'design-react-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setDocumentText, resetValidationResults } from '../redux/actions.js';
import { getDocumentText, isValidationInProgress } from '../redux/selectors.js';
const yaml = require('js-yaml');

export const OtherActionsButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const dispatch = useDispatch();
  const documentText = useSelector((state) => getDocumentText(state));
  const reformatJson = useCallback(() => {
    const reformat = (text) => JSON.stringify(yaml.safeLoad(text), null, 2);
    dispatch(setDocumentText(reformat(documentText)));
    dispatch(resetValidationResults());
  }, [dispatch, documentText]);
  const reformatYaml = useCallback(() => {
    const reformat = (text) => yaml.safeDump(JSON.parse(text), { indent: 2 });
    dispatch(setDocumentText(reformat(documentText)));
    dispatch(resetValidationResults());
  }, [dispatch, documentText]);

  const [open, toggle] = useState(false);
  return (
    <Dropdown isOpen={open} toggle={() => toggle(!open)}>
      <DropdownToggle color="primary" disabled={validationInProgress} outline caret>
        Other actions...
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => reformatJson()}>
          <Icon className="left" icon="it-upload" aria-hidden size="sm" /> Reformat JSON
        </DropdownItem>
        <DropdownItem onClick={() => reformatYaml()}>
          <Icon className="left" icon="it-upload" aria-hidden size="sm" /> Convert to YAML
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
