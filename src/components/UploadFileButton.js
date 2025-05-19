import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import {
  resetValidationResults,
  setDocumentFile,
  setFilename,
} from "../redux/actions.js";
import { isValidationInProgress } from "../redux/selectors.js";

export const UploadFileButton = () => {
  const validationInProgress = useSelector((state) =>
    isValidationInProgress(state)
  );
  const dispatch = useDispatch();
  const loadFile = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = (loadedEvent) => {
          dispatch(setDocumentFile(loadedEvent.target.result));
          dispatch(setFilename(file.name));
          dispatch(resetValidationResults());
        };
        reader.readAsText(file, "UTF-8");
      }
    },
    [dispatch]
  );

  const labelAsButton = cx(
    {
      disabled: validationInProgress,
    },
    ["btn", "btn-outline-primary"]
  );

  return (
    <label role="button" className={labelAsButton}>
      Upload file{" "}
      <input type="file" accept=".yaml, .yml" hidden onChange={loadFile} />
    </label>
  );
};
