import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, Icon } from 'design-react-kit';
import { DropdownItem } from 'reactstrap';
import { triggerFormat } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';

export const PrettifyButton = () => {
  const dispatch = useDispatch();
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const handleFormat = useCallback(
    (tabSize) => {
      dispatch(triggerFormat(tabSize));
    },
    [dispatch]
  );

  return (
    <Dropdown isOpen={open} toggle={toggle}>
      <DropdownToggle color="primary" outline caret disabled={validationInProgress}>
        Prettify ...
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => handleFormat(2)}>
          <Icon className="left" icon="it-code-circle" aria-hidden size="sm" />
          2 Spaces
        </DropdownItem>
        <DropdownItem onClick={() => handleFormat(4)}>
          <Icon className="left" icon="it-code-circle" aria-hidden size="sm" />
          4 Spaces
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
