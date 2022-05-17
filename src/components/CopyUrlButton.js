import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Icon } from 'design-react-kit';
import { useSelector } from 'react-redux';
import { getDocumentText, isValidationInProgress } from '../redux/selectors.js';
import { b64url_encode } from '../utils.mjs';

const MAX_SNIPPET_SIZE = 16000;

export const CopyUrlButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const documentText = useSelector((state) => getDocumentText(state));
  const isDocumentTextTooLong = (documentText) => new TextEncoder().encode(documentText).length > MAX_SNIPPET_SIZE;
  const editorTextAsUrl = () => {
    if (isDocumentTextTooLong(documentText)) {
      alert('Snippet is too long.');
    } else {
      const url = `${window.location.origin}${window.location.pathname}?text=${b64url_encode(documentText)}`;
      window.location.href = url;
    }
  };

  const [open, toggle] = useState(false);
  return (
    <Dropdown isOpen={open} toggle={() => toggle(!open)}>
      <DropdownToggle color="primary" disabled={validationInProgress} outline caret>
        Show ...
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          <Icon className="left" icon="it-copy" aria-hidden size="sm" />
          <span onClick={editorTextAsUrl}>Editor text as URL</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
