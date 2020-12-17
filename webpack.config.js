const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const srcPath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: `${srcPath}/App.js`,
  devtool: 'source-map',
  devServer: {
    contentBase: buildPath,
    open: true,
    compress: true,
    port: 3000,
    host: '0.0.0.0' // To expose contents via docker
  },
  mode: 'development',
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(woff(2)?|ico|png|jpg|jpeg|svg|ttf)$/i, type: 'asset', generator: { filename: '[name].[contenthash][ext]' }},
    ]
  },
  output: {
    filename: '[contenthash].js', // TODO: [name] is too long for monaco files and gh pages blocks js scripts
    path: buildPath,
    publicPath: '',
  },
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: `${srcPath}/index.html`,
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public_new_ui', to: '.' },
      ],
    }),
    new MonacoWebpackPlugin()
  ],
  resolve: {
    extensions: ['.js', '.json'],
    fallback: {
      'vm': 'vm-browserify',
      'fs': false
    }
  }
}