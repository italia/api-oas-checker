import React, { useCallback, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Icon } from 'design-react-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setDocumentUrl, resetValidationResults, setTemplateDocumentName } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';
import { TEMPLATE_DOCUMENT_URL } from '../utils.mjs';

export const LoadTestfileButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const dispatch = useDispatch();
  const handleOnClick = useCallback(
    (url) => {
      console.log(`Loading ${url}`);
      setTemplateDocumentName(url);
      dispatch(setDocumentUrl(url));
      dispatch(resetValidationResults());
    },
    [dispatch]
  );

  const [open, toggle] = useState(false);
  return (
    <Dropdown isOpen={open} toggle={() => toggle(!open)}>
      <DropdownToggle color="primary" disabled={validationInProgress} outline caret>
        From template...
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => handleOnClick(TEMPLATE_DOCUMENT_URL)}>
          <Icon className="left" icon="it-upload" aria-hidden size="sm" /> Example API
        </DropdownItem>
        <DropdownItem onClick={() => handleOnClick('errorfile.yaml')}>
          <Icon className="left" icon="it-upload" aria-hidden size="sm" /> Example API with error
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
