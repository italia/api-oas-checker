const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const packageJson = require('./package.json');

const srcPath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production';
const optimization = isProduction
  ? {
      minimizer: [
        // `...` is the webpack@5 syntax to extend existing minimizers (i.e. `terser-webpack-plugin`)
        `...`,
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](monaco-editor)[\\/]/, // monaco-editor has a huge bundle size
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    }
  : {};

module.exports = {
  entry: `${srcPath}/index.js`,
  devtool: isProduction ? false : 'source-map',
  devServer: {
    static: buildPath,
    open: true,
    compress: true,
    hot: true,
    port: 3000,
    host: '0.0.0.0', // To expose contents via docker
  },
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      { test: /\.(m)?js$/, use: ['babel-loader'], exclude: /node_modules/ },
      {
        test: /\.(s)?css$/,
        use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff(2)?|ico|png|jpg|jpeg|svg|ttf)$/i,
        type: 'asset',
        generator: { filename: '[name].[contenthash][ext]' },
      },
    ],
  },
  optimization,
  output: {
    filename: '[name].[contenthash].js',
    path: buildPath,
    publicPath: '',
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.' },
        { from: 'functions', to: 'functions' },
        { from: 'spectral*.yml', to: '.' },
        { from: 'spectral*.doc.html', to: '.' },
      ],
    }),
    new webpack.DefinePlugin({
      REPO_URL: JSON.stringify(packageJson.repository),
      VERSION: JSON.stringify(packageJson.version),
    }),
    new HtmlWebpackPlugin({
      template: `${srcPath}/index.html`,
      filename: 'index.html',
    }),
    // Extracts CSS into separate files
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),

    new MonacoWebpackPlugin({
      languages: ['yaml'],
        customLanguages: [{
          label: 'yaml',
          entry: ['monaco-yaml', 'vs/basic-languages/yaml/yaml.contribution'],
          worker: {
            id: 'vs/language/yaml/yamlWorker',
            entry: 'monaco-yaml/yaml.worker.js'
          }
        }]
    }),
  ],
  resolve: {
    extensions: ['.js', '.json'],
    fallback: {
      vm: false,
      fs: false,
    },
  },
  // https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-706840237
  // https://webpack.js.org/configuration/target/
  target: isProduction ? 'browserslist' : 'web',
};
