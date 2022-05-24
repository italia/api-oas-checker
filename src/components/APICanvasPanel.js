import React from 'react';
import { Document } from '@stoplight/spectral/dist/document';
import { Yaml } from '@stoplight/spectral/dist/parsers/yaml';

import { CSVLink } from 'react-csv';
import YAML from 'yaml';
import { useSelector } from 'react-redux';
import { getDocumentText } from '../redux/selectors.js';
import TableSearch from './TableSearch.js';

import './APICanvasPanel.css';

function renderSchema(schema) {
  const nativeTypes = ['object', 'array', 'string', 'number'];
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
  console.warn('Unknown schema type', schema);
  return 'Unknown type';
}
function listSuccessfulResponses(operation) {
  const responses = [];
  if (operation.responses) {
    console.log('responses', operation.responses);
    Object.keys(operation.responses).forEach((status) => {
      const response = operation.responses[status];
      if (status >= 200 && status < 300) {
        if (!response.content) {
          return '-';
        }
        Object.keys(response.content).forEach((contentType) => {
          const schema = response.content[contentType].schema;
          if (schema) {
            responses.push(`${status} ${renderSchema(schema)}  ${contentType}`);
          }
        });
      }
    });
  }
  return responses;
}

function listRequestBody(operation) {
  const requestBody = [];
  const renderRequestBody = (body) => {
    if (body.content) {
      Object.keys(body.content).forEach((contentType) => {
        const schema = body.content[contentType].schema;
        if (schema) {
          requestBody.push(`${renderSchema(schema)} ${contentType}`);
        }
      });
    }
    return requestBody;
  };
  if (operation.requestBody) {
    renderRequestBody(operation.requestBody);
  }
  return requestBody;
}
function listParameters(operationOrPath) {
  const renderParameter = (parameter) => {
    if (parameter.name) {
      return `${parameter.name}${parameter.name.required ? '*' : ''}(${parameter.in})`;
    }
    if (parameter['$ref'] && parameter['$ref'].startsWith('#/components/parameters/')) {
      return '**' + parameter['$ref'].replace('#/components/parameters/', '') + '**';
    }
    return 'Unknown parameter';
  };

  const parameters = [];
  if (operationOrPath.parameters) {
    operationOrPath.parameters.forEach((parameter) => {
      parameters.push(renderParameter(parameter));
    });
  }
  return parameters;
}
function listOperations(document) {
  const operations = [];
  if (document && document.paths) {
    Object.keys(document.paths).forEach((path) => {
      const p = document.paths[path];

      Object.keys(p).forEach((method) => {
        const o = p[method];
        if (o.operationId) {
          const row = {
            id: o.operationId,
            how: `${method.toUpperCase()} ${path}`,
            what: o.summary,
            who: o.security,
            goal: o.tags,
            inputs: listParameters(o).concat(listParameters(p).concat(listRequestBody(o))),
            outputs: listSuccessfulResponses(o),
          };
          operations.push(row);
        }
      });
    });
  }
  return operations;
}

export const APICanvasPanel = () => {
  try {
    const documentText = useSelector((state) => getDocumentText(state));
    const document = new Document(documentText, Yaml);
    console.log('spectral document', document);
    const oas = document.data;
    const ops = listOperations(oas);
    const rows = ops.map((row) => ({
      id: row.id,
      goal: YAML.stringify(row.goal),
      who: YAML.stringify(row.who),
      what: row.what,
      how: row.how,
      inputs: YAML.stringify(row.inputs),
      outputs: YAML.stringify(row.outputs),
    }));
    console.log('rows', rows);
    const csvFilename = `${oas.info.title.trim().replace(' ', '_')}-${oas.info.version}-canvas.csv`;
    return (
      <div>
        <CSVLink data={rows} filename={csvFilename}>
          Download Canvas
        </CSVLink>
        <TableSearch className={'apiCanvas'} data={rows} />
      </div>
    );
  } catch (e) {
    console.error(e);
    return <div>Cannot render a canvas of an invalid OAS specification.</div>;
  }
};
