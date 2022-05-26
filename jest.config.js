module.exports = {
  globals: {
    REPO_URL: 'https://localhost',
    VERSION: '1.0.0',
  },
  transform: { 
    '\\.m?[jt]sx?$': 'babel-jest',
    "^.+\\.svg$": "./transformers/svg.js"
  },
  transformIgnorePatterns: ['/node_modules/(?!monaco-editor)/'],
  //ignore css imported in components
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api.js',
    '^worker-loader.+$': '<rootDir>/src/mocks/workerMock.js'
  },
  testEnvironment: "jsdom"
};
