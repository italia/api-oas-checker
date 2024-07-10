const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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

// ----- Retrieval of the rules.

const directoryPath = path.join(__dirname, '/rulesets');

const readFirstTwoLines = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  return {
    firstLine: lines[0],
    secondLine: lines[1]
  };
};

// Function to synchronously retrieve file names from a directory
const getFilesInDirectory = (directoryPath) => {
  try {
    const files = fs.readdirSync(directoryPath);
    const fileMap = {};

    files.forEach((file) => {
      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        const filePath = path.join(directoryPath, file);
        const { firstLine, secondLine } = readFirstTwoLines(filePath);

        const nameMatch = firstLine.match(/#\tRuleset name:\s*(.*)/);
        const versionMatch = secondLine.match(/#\tRuleset version:\s*(.*)/);

        if (nameMatch && versionMatch) {
          const rulesetName = nameMatch[1].trim();
          const rulesetVersion = versionMatch[1].trim();
          fileMap["rulesets/" + file] = {
            rulesetName,
            rulesetVersion
          };
        }
      }
    });
    return fileMap;
  } catch (err) {
    console.error('Error reading directory:', err);
    return {};
  }
};
  
const filesDictionary = getFilesInDirectory(directoryPath);
const getDefault = (fileMap) => {
  // Look for the filePath with the rulesetName "Italian API Guidelines"
  const specificFilePath = Object.keys(fileMap).find(filePath => fileMap[filePath].rulesetName === "Italian Guidelines");

  // If found, return the specific filePath
  if (specificFilePath) {
    return specificFilePath;
  }

  const filePaths = Object.keys(fileMap);
  return filePaths[0];
};

const firstFilePath = Object.keys(filesDictionary)[0];
const rulesVersion = firstFilePath ? filesDictionary[firstFilePath].rulesetVersion.trim() : "N.A.";

// ----- Retrieval of the rules.

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
        { from: directoryPath, to: 'rulesets' },
      ],
    }),
    new webpack.DefinePlugin({
      REPO_URL: JSON.stringify(packageJson.repository),
      VERSION: JSON.stringify(packageJson.version),
      FILES_DICTIONARY: JSON.stringify(filesDictionary),
      DEFAULT_RULESET: JSON.stringify(getDefault(filesDictionary)),
      RULESETS_VERSION: JSON.stringify(rulesVersion),
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
