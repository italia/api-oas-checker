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
const YAML = require('yaml');
const packageJson = require('./package.json');

// Constants
const RULES_REPO_URL = 'https://api.github.com/repos/italia/api-oas-checker-rules/releases/latest';

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
    console.log(`Fetching latest release from ${RULES_REPO_URL}...`);
    const response = await axios.get(RULES_REPO_URL);
    const latestRelease = response.data;
    const assets = latestRelease.assets;

    if (!assets || assets.length === 0) {
      console.warn('No assets found in the latest release.');
      return;
    }

    for (const asset of assets) {
      try {
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
      } catch (assetError) {
        console.error(`Error downloading or processing asset ${asset.name}:`, assetError.message);
        // Continue with other assets
      }
    }
    console.log('Assets processing completed.');
  } catch (error) {
    console.error('Error fetching latest release info:', error.message);
    // Do not throw, allow build to proceed with existing files if any
  }
}

// Function to retrieve file names and metadata from a directory using YAML parsing
const getFilesInDirectory = (rulesetsPath) => {
  try {
    if (!fs.existsSync(rulesetsPath)) {
      return {};
    }
    const files = fs.readdirSync(rulesetsPath);
    const fileMap = {};

    files.forEach((file) => {
      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        const filePath = path.join(rulesetsPath, file);
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const doc = YAML.parseDocument(fileContent);
          
          // Access comments before the document
          const commentBefore = doc.commentBefore || '';
          
          const nameMatch = commentBefore.match(/Ruleset name:\s*(.*)/i);
          const versionMatch = commentBefore.match(/Ruleset version:\s*(.*)/i);

          if (nameMatch && versionMatch) {
            const rulesetName = nameMatch[1].trim();
            const rulesetVersion = versionMatch[1].trim();
            fileMap['rulesets/' + file] = {
              rulesetName,
              rulesetVersion,
            };
          }
        } catch (parseError) {
          console.error(`Error parsing YAML file ${file}:`, parseError.message);
        }
      }
    });
    return fileMap;
  } catch (err) {
    console.error('Error reading rulesets directory:', err);
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
  
  // Fallback if dictionary is empty (e.g. download failed and no local files)
  if (Object.keys(filesDictionary).length === 0) {
    console.warn('No rulesets found. Application may not function correctly without rulesets.');
  }

  const firstFilePath = Object.keys(filesDictionary)[0];
  rulesVersion = firstFilePath ? filesDictionary[firstFilePath].rulesetVersion.trim() : 'N.A.';
}

const getDefault = (fileMap) => {
  const specificFilePath = Object.keys(fileMap).find(
    (filePath) => fileMap[filePath].rulesetName === 'Italian Guidelines'
  );
  return specificFilePath || Object.keys(fileMap)[0];
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
          minimizer: ['...', new CssMinimizerPlugin()],
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
