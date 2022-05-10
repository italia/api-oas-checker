import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Icon } from 'design-react-kit';
import { useSelector } from 'react-redux';
import { getDocumentText, isValidationInProgress } from '../redux/selectors.js';
import { b64url_encode } from '../utils.mjs';

export const CopyUrlButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const documentText = useSelector((state) => getDocumentText(state));

  const [open, toggle] = useState(false);
  return (
    <Dropdown isOpen={open} toggle={() => toggle(!open)}>
      <DropdownToggle color="primary" disabled={validationInProgress} outline caret>
        Show ...
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          <Icon className="left" icon="it-copy" aria-hidden size="sm" />
          <a href={window.location.href + '?text=' + b64url_encode(documentText)}>editor text as URL</a>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
