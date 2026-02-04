import React, { useMemo } from 'react';
import SwaggerUI from 'swagger-ui-react';
import { Yaml } from '@stoplight/spectral-parsers';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getDocumentText } from '../redux/selectors.js';
import './SwaggerPanel.css';

class OperationsLayout extends React.Component {
  render() {
    const { getComponent } = this.props;
    const Component = getComponent('Models', true);
    return (
      <div>
        <Component />
      </div>
    );
  }
}
OperationsLayout.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

const OperationsLayoutPlugin = () => ({
  components: {
    OperationsLayout,
  },
});

export const SwaggerPanel = () => {
  const documentText = useSelector((state) => getDocumentText(state));

  const spec = useMemo(() => {
    try {
      return Yaml.parse(documentText).data;
    } catch (e) {
      return documentText;
    }
  }, [documentText]);

  const hasSchemas = useMemo(() => {
    if (typeof spec === 'object' && spec !== null) {
      const hasOas3Schemas = spec.components && spec.components.schemas && Object.keys(spec.components.schemas).length > 0;
      const hasOas2Definitions = spec.definitions && Object.keys(spec.definitions).length > 0;
      return hasOas3Schemas || hasOas2Definitions;
    }
    // If spec is a string or parsing failed, we assume true to let SwaggerUI handle/show errors,
    // or we could try to regex check, but safer to show it.
    // However, if we are sure it's valid yaml but empty schemas...
    return true; 
  }, [spec]);

  if (typeof spec === 'object' && !hasSchemas) {
     return (
        <div className="alert alert-info mt-3" role="alert">
          <span className="font-weight-bold">No schemas found.</span>
          <br />
          The specification does not contain data model definitions (Schemas or Definitions).
        </div>
      );
  }

  return (
    <div className="swagger-panel-container">
       <div className="mb-4 text-muted description-text">
          This section displays the data models (schemas) defined in the API specifications.
          Here you can examine the structure of objects used in requests and responses.
        </div>
      <SwaggerUI
        spec={spec}
        plugins={[OperationsLayoutPlugin]}
        layout={'OperationsLayout'}
        showCommonExtensions={true}
      />
    </div>
  );
};
