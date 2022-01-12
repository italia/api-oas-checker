import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import { setDocumentUrl, resetValidationResults } from '../redux/actions.js';
import { isValidationInProgress } from '../redux/selectors.js';

export const UploadFileButton = () => {
  const validationInProgress = useSelector((state) => isValidationInProgress(state));
  const dispatch = useDispatch();
  const loadFile = useCallback(
    (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadedEvent) => {
        dispatch(setDocumentUrl(loadedEvent.target.result));
        dispatch(resetValidationResults());
      };
      reader.readAsDataURL(file);
    },
    [dispatch]
  );

  const labelAsButton = cx(
    {
      disabled: validationInProgress,
    },
    ['btn', 'btn-outline-primary']
  );

  return (
    <label role="button" className={labelAsButton}>
      Upload file <input type="file" hidden onChange={loadFile} />
    </label>
  );
};
