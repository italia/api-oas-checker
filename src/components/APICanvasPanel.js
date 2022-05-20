import React from 'react';
import { Document, Parsers } from '@stoplight/spectral';
import { useSelector } from 'react-redux';
import YAML from 'yaml';
import { getDocumentText } from '../redux/selectors.js';
import TableSearch from './TableSearch.js';
import './APICanvasPanel.css';

function listOpenapiSchemas(document) {
  const operations = [];
  if (document.components && document.components.schemas) {
    Object.keys(document.components.schemas).forEach((schemaName) => {
      const schema = document.components.schemas[schemaName];
      if (schema.properties) {
        operations.push(schema.properties);
      }
    });
  }
  return operations;
}

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
  const documentText = useSelector((state) => getDocumentText(state));
  const document = new Document(documentText, Parsers.Yaml);
  console.log('spectral document', document);
  const ops = listOperations(document.data);
  console.log('rows', ops);

  // return JSON.stringify(ops, null, 2);
  return (
    <TableSearch
      className={'apiCanvas'}
      data={ops.map((row) => ({
        id: row.id,
        goal: YAML.stringify(row.goal),
        who: YAML.stringify(row.who),
        what: row.what,
        how: row.how,
        inputs: YAML.stringify(row.inputs),
        outputs: YAML.stringify(row.outputs),
      }))}
    />
  );
};
