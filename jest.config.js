module.exports = {
  transformIgnorePatterns: ['/node_modules/(?!monaco-editor)/'],
  //ignore css imported in components
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api.js',
  },
};
