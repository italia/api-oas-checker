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
    return `${schema.type}`;
  }

  if (schema['$ref']) {
    if (schema['$ref'].startsWith('#/components/schemas/')) {
      return schema['$ref'].replace('#/components/schemas/', '');
    }
    return schema['$ref'];
  }
  const compoundTypes = ['oneOf', 'anyOf', 'allOf'];
  if (compoundTypes.includes(schema.type)) {
    return 'Compound type ' + schema.type;
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
            responses.push(`${status} ${contentType} ${renderSchema(schema)}`);
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
          requestBody.push(`${contentType} ${renderSchema(schema)}`);
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
      return parameter['$ref'].replace('#/components/parameters/', '');
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

      Object.keys(p).forEach((operation) => {
        const o = p[operation];
        if (o.operationId) {
          const row = {
            id: o.operationId,
            how: `${operation} ${path}`,
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

const mock = [
  {
    id: 'updatePet',
    how: 'put /pet',
    what: 'Update an existing pet',
    who: [{ petstore_auth: ['write:pets', 'read:pets'] }],
    goal: ['pet'],
    inputs: ['application/json Pet', 'application/xml Pet', 'application/x-www-form-urlencoded Pet'],
    outputs: ['200 application/xml Pet', '200 application/json Pet'],
  },
  {
    id: 'addPet',
    how: 'post /pet',
    what: 'Add a new pet to the store',
    who: [{ petstore_auth: ['write:pets', 'read:pets'] }],
    goal: ['pet'],
    inputs: ['application/json Pet', 'application/xml Pet', 'application/x-www-form-urlencoded Pet'],
    outputs: ['200 application/xml Pet', '200 application/json Pet'],
  },
  {
    id: 'findPetsByStatus',
    how: 'get /pet/findByStatus',
    what: 'Finds Pets by status',
    who: [{ petstore_auth: ['write:pets', 'read:pets'] }],
    goal: ['pet'],
    inputs: ['status(query)'],
    outputs: ['200 application/xml array', '200 application/json array'],
  },
  {
    id: 'findPetsByTags',
    how: 'get /pet/findByTags',
    what: 'Finds Pets by tags',
    who: [{ petstore_auth: ['write:pets', 'read:pets'] }],
    goal: ['pet'],
    inputs: ['tags(query)'],
    outputs: ['200 application/xml array', '200 application/json array'],
  },
  {
    id: 'getPetById',
    how: 'get /pet/{petId}',
    what: 'Find pet by ID',
    who: [{ api_key: [] }, { petstore_auth: ['write:pets', 'read:pets'] }],
    goal: ['pet'],
    inputs: ['petId(path)'],
    outputs: ['200 application/xml Pet', '200 application/json Pet'],
  },
  {
    id: 'updatePetWithForm',
    how: 'post /pet/{petId}',
    what: 'Updates a pet in the store with form data',
    who: [{ petstore_auth: ['write:pets', 'read:pets'] }],
    goal: ['pet'],
    inputs: ['petId(path)', 'name(query)', 'status(query)'],
    outputs: [],
  },
  {
    id: 'deletePet',
    how: 'delete /pet/{petId}',
    what: 'Deletes a pet',
    who: [{ petstore_auth: ['write:pets', 'read:pets'] }],
    goal: ['pet'],
    inputs: ['api_key(header)', 'petId(path)'],
    outputs: [],
  },
  {
    id: 'uploadFile',
    how: 'post /pet/{petId}/uploadImage',
    what: 'uploads an image',
    who: [{ petstore_auth: ['write:pets', 'read:pets'] }],
    goal: ['pet'],
    inputs: ['petId(path)', 'additionalMetadata(query)', 'application/octet-stream string'],
    outputs: ['200 application/json ApiResponse'],
  },
  {
    id: 'getInventory',
    how: 'get /store/inventory',
    what: 'Returns pet inventories by status',
    who: [{ api_key: [] }],
    goal: ['store'],
    inputs: [],
    outputs: ['200 application/json object'],
  },
  {
    id: 'placeOrder',
    how: 'post /store/order',
    what: 'Place an order for a pet',
    goal: ['store'],
    inputs: ['application/json Order', 'application/xml Order', 'application/x-www-form-urlencoded Order'],
    outputs: ['200 application/json Order'],
  },
  {
    id: 'getOrderById',
    how: 'get /store/order/{orderId}',
    what: 'Find purchase order by ID',
    goal: ['store'],
    inputs: ['orderId(path)'],
    outputs: ['200 application/xml Order', '200 application/json Order'],
  },
  {
    id: 'deleteOrder',
    how: 'delete /store/order/{orderId}',
    what: 'Delete purchase order by ID',
    goal: ['store'],
    inputs: ['orderId(path)'],
    outputs: [],
  },
  {
    id: 'createUser',
    how: 'post /user',
    what: 'Create user',
    goal: ['user'],
    inputs: ['application/json User', 'application/xml User', 'application/x-www-form-urlencoded User'],
    outputs: [],
  },
  {
    id: 'createUsersWithListInput',
    how: 'post /user/createWithList',
    what: 'Creates list of users with given input array',
    goal: ['user'],
    inputs: ['application/json array'],
    outputs: ['200 application/xml User', '200 application/json User'],
  },
  {
    id: 'loginUser',
    how: 'get /user/login',
    what: 'Logs user into the system',
    goal: ['user'],
    inputs: ['username(query)', 'password(query)'],
    outputs: ['200 application/xml string', '200 application/json string'],
  },
  {
    id: 'logoutUser',
    how: 'get /user/logout',
    what: 'Logs out current logged in user session',
    goal: ['user'],
    inputs: [],
    outputs: [],
  },
  {
    id: 'getUserByName',
    how: 'get /user/{username}',
    what: 'Get user by user name',
    goal: ['user'],
    inputs: ['username(path)'],
    outputs: ['200 application/xml User', '200 application/json User'],
  },
  {
    id: 'updateUser',
    how: 'put /user/{username}',
    what: 'Update user',
    goal: ['user'],
    inputs: [
      'username(path)',
      'application/json User',
      'application/xml User',
      'application/x-www-form-urlencoded User',
    ],
    outputs: [],
  },
  {
    id: 'deleteUser',
    how: 'delete /user/{username}',
    what: 'Delete user',
    goal: ['user'],
    inputs: ['username(path)'],
    outputs: [],
  },
];
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
      data={mock.map((row) => ({
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
