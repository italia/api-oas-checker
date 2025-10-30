const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const axios = require('axios');
const AdmZip = require('adm-zip');
const packageJson = require('./package.json');

const srcPath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production';

const rulesetsPath = path.join(__dirname, 'rulesets');

// Ensure rulesets directory exists
if (!fs.existsSync(rulesetsPath)) {
  fs.mkdirSync(rulesetsPath, { recursive: true });
}

async function downloadLatestRelease() {
  try {
    const response = await axios.get('https://api.github.com/repos/italia/api-oas-checker-rules/releases/latest');
    const latestRelease = response.data;
    const assets = latestRelease.assets;

    for (const asset of assets) {
      console.log(`Downloading asset: ${asset.name} from ${asset.browser_download_url}`);
      const assetResponse = await axios.get(asset.browser_download_url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(assetResponse.data);

      if (asset.name === 'functions.zip') {
        console.log('Extracting functions.zip...');
        const zip = new AdmZip(buffer);
        const functionsPath = path.join(rulesetsPath, 'functions');

        // Ensure the functions directory exists
        if (!fs.existsSync(functionsPath)) {
          fs.mkdirSync(functionsPath, { recursive: true });
        }

        zip.extractAllTo(functionsPath, true);
        console.log(`functions.zip extracted to ${functionsPath}`);
      } else {
        const filePath = path.join(rulesetsPath, asset.name);
        fs.writeFileSync(filePath, buffer);
        console.log(`Asset ${asset.name} saved to ${filePath}`);
      }
    }
    console.log('All assets processed successfully');
  } catch (error) {
    console.error('Error downloading latest release:', error);
  }
}

// Function to synchronously retrieve file names from a directory
const getFilesInDirectory = (rulesetsPath) => {
  try {
    const files = fs.readdirSync(rulesetsPath);
    const fileMap = {};

    files.forEach((file) => {
      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        const filePath = path.join(rulesetsPath, file);
        const { firstLine, secondLine } = readFirstTwoLines(filePath);

        const nameMatch = firstLine.match(/#\tRuleset name:\s*(.*)/);
        const versionMatch = secondLine.match(/#\tRuleset version:\s*(.*)/);

        if (nameMatch && versionMatch) {
          const rulesetName = nameMatch[1].trim();
          const rulesetVersion = versionMatch[1].trim();
          fileMap['rulesets/' + file] = {
            rulesetName,
            rulesetVersion,
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

let filesDictionary = {};
let rulesVersion = 'N.A.';

async function initializeRulesets() {
  if (!isProduction) {
    await downloadLatestRelease();
  }
  filesDictionary = getFilesInDirectory(rulesetsPath);
  const firstFilePath = Object.keys(filesDictionary)[0];
  rulesVersion = firstFilePath ? filesDictionary[firstFilePath].rulesetVersion.trim() : 'N.A.';
}

const getDefault = (fileMap) => {
  const specificFilePath = Object.keys(fileMap).find(
    (filePath) => fileMap[filePath].rulesetName === 'Italian Guidelines Full'
  );
  return specificFilePath || Object.keys(fileMap)[0];
};

const readFirstTwoLines = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  return {
    firstLine: lines[0],
    secondLine: lines[1],
  };
};

module.exports = async () => {
  await initializeRulesets();

  return {
    entry: `${srcPath}/index.js`,
    devtool: isProduction ? false : 'source-map',
    stats: { children: true },
    devServer: {
      static: buildPath,
      open: true,
      compress: true,
      hot: true,
      port: 3000,
      host: '0.0.0.0',
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
    optimization: isProduction
      ? {
          minimizer: [`...`, new CssMinimizerPlugin()],
          splitChunks: {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/](monaco-editor)[\\/]/,
                name: 'vendor',
                chunks: 'all',
              },
            },
          },
        }
      : {},
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
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public', to: '.' },
          {
            from: rulesetsPath,
            to: 'rulesets',
            noErrorOnMissing: true,
          },
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
      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
      new MonacoWebpackPlugin({
        languages: ['yaml'],
        customLanguages: [
          {
            label: 'yaml',
            entry: ['monaco-yaml', 'vs/basic-languages/yaml/yaml.contribution'],
            worker: {
              id: 'vs/language/yaml/yamlWorker',
              entry: 'monaco-yaml/yaml.worker.js',
            },
          },
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.json'],
      fallback: {
        vm: false,
        fs: false,
        path: require.resolve('path-browserify'),
      },
    },
    target: isProduction ? 'browserslist' : 'web',
  };
};
