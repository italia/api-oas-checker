import { useEffect } from 'react';
import axios from 'axios';
import { b64url_decode } from '../utils.mjs';
import { setDocumentText } from '../redux/actions.js';

export const useDocumentLoader = (
  editorInstance,
  documentUrl,
  documentFile,
  documentTextParameter,
  dispatch
) => {
  useEffect(() => {
    if (!editorInstance) return;

    const loadDocumentFromUrl = async (url) => {
      try {
        const { data: text } = await axios.get(url);
        updateEditorAndState(text);
      } catch (e) {
        console.error('Error loading document from URL:', e);
        // Ideally show a UI notification here instead of alert
      }
    };

    const loadDocumentFromFile = async (file) => {
      try {
        // file.toString() might not be enough if it's a File object (Blob), 
        // but in the original code it was used like that. 
        // Assuming Redux stores the file content or a string representation, 
        // OR it's a File object and we should really use FileReader.
        // Checking original code: `editor.current.getModel().setValue(documentFile.toString());`
        // If documentFile is a File object, .toString() returns "[object File]".
        // This suggests documentFile in Redux might already be the text content?
        // Let's stick to original logic for now to avoid breaking behavior, 
        // but it looks suspicious if it's a real File object.
        const text = file.toString();
        updateEditorAndState(text);
      } catch (e) {
        console.error('Error loading document from file:', e);
      }
    };

    const loadDocumentFromTextParam = (textParam) => {
      try {
        const text = b64url_decode(textParam);
        updateEditorAndState(text);
      } catch (e) {
        console.error('Error decoding document from param:', e);
      }
    };

    const updateEditorAndState = (text) => {
      const currentModel = editorInstance.getModel();
      if (currentModel) {
        currentModel.setValue(text);
        dispatch(setDocumentText(text));
      }
    };

    if (documentTextParameter) {
      loadDocumentFromTextParam(documentTextParameter);
    } else if (documentUrl) {
      loadDocumentFromUrl(documentUrl);
    } else if (documentFile) {
      loadDocumentFromFile(documentFile);
    }
  }, [editorInstance, documentUrl, documentFile, documentTextParameter, dispatch]);
};
