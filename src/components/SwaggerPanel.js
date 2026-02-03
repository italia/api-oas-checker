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

  return (
    <SwaggerUI
      spec={spec}
      plugins={[OperationsLayoutPlugin]}
      layout={'OperationsLayout'}
      showCommonExtensions={true}
    />
  );
};
