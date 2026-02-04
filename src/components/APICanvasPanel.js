import React, { useMemo } from 'react';
import { Document } from '@stoplight/spectral-core';
import { Yaml } from '@stoplight/spectral-parsers';
import { CSVLink } from 'react-csv';
import YAML from 'yaml';
import { useSelector } from 'react-redux';
import { getDocumentText } from '../redux/selectors.js';
import TableSearch from './TableSearch.js';
import './APICanvasPanel.css';

/**
 * Renders a schema type or reference in a readable format.
 * @param {object} schema - The schema object.
 * @returns {string} The formatted schema description.
 */
function renderSchema(schema) {
  const nativeTypes = ['object', 'array', 'string', 'number', 'boolean', 'integer'];
  if (nativeTypes.includes(schema.type)) {
    return `__${schema.type}__`;
  }

  if (schema['$ref']) {
    if (schema['$ref'].startsWith('#/components/schemas/')) {
      return '**' + schema['$ref'].replace('#/components/schemas/', '') + '**';
    }
    return schema['$ref'];
  }
  const compoundTypes = ['oneOf', 'anyOf', 'allOf'];
  if (compoundTypes.includes(schema.type)) {
    return `Compound type __${schema.type}__`;
  }
  
  if (!schema.type && !schema['$ref']) {
      return 'Unknown type';
  }
  
  console.warn('Unknown schema type', schema);
  return 'Unknown type';
}

/**
 * Lists successful responses (2xx) for an operation.
 * @param {object} operation - The operation object.
 * @returns {Array<string>} List of response descriptions.
 */
function listSuccessfulResponses(operation) {
  const responses = [];
  if (operation.responses) {
    Object.keys(operation.responses).forEach((status) => {
      const response = operation.responses[status];
      if (status >= 200 && status < 300) {
        if (!response.content) {
          responses.push(`${status} -`);
          return;
        }
        Object.keys(response.content).forEach((contentType) => {
          const schema = response.content[contentType].schema;
          if (schema) {
            responses.push(`${status} ${renderSchema(schema)}<br/>${contentType}`);
          }
        });
      }
    });
  }
  return responses;
}

/**
 * Lists request body schemas for an operation.
 * @param {object} operation - The operation object.
 * @returns {Array<string>} List of request body descriptions.
 */
function listRequestBody(operation) {
  const requestBody = [];
  if (operation.requestBody && operation.requestBody.content) {
    Object.keys(operation.requestBody.content).forEach((contentType) => {
      const content = operation.requestBody.content[contentType];
      if (content && content.schema) {
        requestBody.push(`Body: ${renderSchema(content.schema)} (${contentType})`);
      }
    });
  }
  return requestBody;
}

/**
 * Lists parameters for an operation or path item.
 * @param {object} operationOrPath - The operation or path item object.
 * @returns {Array<string>} List of parameter descriptions.
 */
function listParameters(operationOrPath) {
  const renderParameter = (parameter) => {
    if (parameter.name) {
      return `${parameter.name}${parameter.required ? '*' : ''}(${parameter.in})`;
    }
    if (parameter['$ref'] && parameter['$ref'].startsWith('#/components/parameters/')) {
      return '**' + parameter['$ref'].replace('#/components/parameters/', '') + '**';
    }
    return 'Unknown parameter';
  };

  const parameters = [];
  if (operationOrPath && operationOrPath.parameters && Array.isArray(operationOrPath.parameters)) {
    operationOrPath.parameters.forEach((parameter) => {
      parameters.push(renderParameter(parameter));
    });
  }
  return parameters;
}

/**
 * Extracts operations from the OpenAPI document.
 * @param {object} document - The OpenAPI document.
 * @returns {Array<object>} List of operations.
 */
function listOperations(document) {
  const operations = [];
  if (document && document.paths) {
    Object.keys(document.paths).forEach((path) => {
      const p = document.paths[path];
      if (!p || typeof p !== 'object') return;

      Object.keys(p).forEach((method) => {
        const o = p[method];
        if (o && typeof o === 'object' && !['summary', 'description', 'parameters', 'servers'].includes(method)) {
          const row = {
            method: method.toUpperCase(),
            path: path,
            inputs: listParameters(o).concat(listParameters(p).concat(listRequestBody(o))),
            outputs: listSuccessfulResponses(o),
            // Optional/Secondary fields
            id: o.operationId || '',
            what: o.summary || '',
            who: o.security || [],
            goal: o.tags || [],
          };
          operations.push(row);
        }
      });
    });
  }
  return operations;
}

/**
 * Hook to retrieve and parse API Canvas data from the Redux store.
 * @returns {object} An object containing:
 *  - rows: Array of data rows for the canvas table.
 *  - csvFilename: Suggested filename for CSV download.
 *  - error: Error message if parsing fails.
 */
export const useApiCanvasData = () => {
  const documentText = useSelector((state) => getDocumentText(state));

  return useMemo(() => {
    try {
      if (!documentText) {
        return { rows: [], csvFilename: '', error: 'No document loaded.' };
      }
      const document = new Document(documentText, Yaml);
      let oas = document.data;

      // Handle potential parser result wrapping
      if (oas && oas.data && !oas.paths && !oas.openapi) {
        oas = oas.data;
      }

      if (!oas || typeof oas !== 'object') {
        return { rows: [], csvFilename: '', error: 'Invalid OpenAPI specification.' };
      }

      const ops = listOperations(oas);
      const rows = ops.map((row) => ({
        method: row.method,
        path: row.path,
        inputs: YAML.stringify(row.inputs),
        outputs: YAML.stringify(row.outputs),
        id: row.id,
        goal: row.goal.length > 0 ? YAML.stringify(row.goal) : '',
        who: row.who.length > 0 ? YAML.stringify(row.who) : '',
        what: row.what,
      }));

      const title = oas?.info?.title ? oas.info.title.trim().replace(/\s+/g, '_') : 'api';
      const version = oas?.info?.version || 'unknown';
      const csvFilename = `${title}-${version}-canvas.csv`;

      return { rows, csvFilename, error: null };
    } catch (e) {
      console.error('API Canvas P Error:', e);
      return { rows: [], csvFilename: '', error: e.message };
    }
  }, [documentText]);
};

/**
 * Component to display the API Canvas table.
 * @param {object} props
 * @param {Array} props.rows - The data rows to display.
 */
export const APICanvasTable = ({ rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="alert alert-info mt-3" role="alert">
        <span className="font-weight-bold">No operations found.</span>
        <br />
        The specification does not contain valid or analyzable operations to generate the Canvas.
      </div>
    );
  }

  return (
    <div className="swagger-panel-container">
      <div className="mb-4 text-muted description-text">
        This view offers an overview of API operations, including methods, paths, inputs, and outputs.
        It is useful for quickly understanding the exposed functionalities.
      </div>
      <TableSearch className={'apiCanvas'} data={rows} />
    </div>
  );
};