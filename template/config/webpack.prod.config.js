const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');

const project = require('./project');

const GLOBALS = {
    'process.env': {
        'NODE_ENV': JSON.stringify('production')
    },
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
};

module.exports = {
  target: 'electron-renderer',
  entry: {
    // Export the electron renderer for use with npm run start:prod
    electron: path.resolve(project.path.electron, 'renderer/index.js'),

    // Export the entry to our plugin. Referenced in package.json main.
    index: path.resolve(project.path.src, 'index.js')
  },
  output: {
    path: project.path.output,
    publicPath: './',
    filename: '[name].js',
    // Export our plugin as a UMD library (compatible with all module definitions - CommonJS, AMD and global variable)
    library: '{{pascalcase name}}Plugin',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.json', 'less'],
    alias: {
      actions: path.join(project.path.src, 'actions'),
      components: path.join(project.path.src, 'components'),
      constants: path.join(project.path.src, 'constants'),
      fonts: path.join(project.path.src, 'assets/fonts'),
      images: path.join(project.path.src, 'assets/images'),
      less: path.join(project.path.src, 'assets/less'),
      models: path.join(project.path.src, 'models'),
      plugin: path.join(project.path.src, 'index.js'),
      stores: path.join(project.path.src, 'stores'),
      storybook: project.path.storybook,
      utils: path.join(project.path.src, 'utils')
    }
  },
  module: {
    rules: [
      // Extract only the global index.less file to a index.css file for use in standalone electron prod
      // testing with npm run start:prod. These styles WILL NOT be imported by compass.
      {
        test: /\.less$/,
        exclude: /node_modules/,
        include: /less\/index\.less/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '{{pascalcase name}}_[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    project.plugin.autoprefixer
                  ];
                }
              }
            },
            {
              loader: 'less-loader',
              options: {
                noIeCompat: true
              }
            }
          ]
        })
      },
      // Ignore the index.less file and use the style-loader for all other less imports so that they are included
      // with the JavaScript imported by compass. These styles WILL be imported in compass.
      {
        test: /\.less$/,
        exclude: [
          /node_modules/,
          /less\/index\.less/
        ],
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '{{pascalcase name}}__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  project.plugin.autoprefixer
                ];
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              noIeCompat: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader'},
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /(node_modules)/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          query: {
            limit: 8192,
            name: 'assets/images/[name]__[hash:base64:5].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader',
          query: {
            limit: 8192,
            name: 'assets/fonts/[name]__[hash:base64:5].[ext]'
          }
        }],
      }
    ]
  },
  plugins: [
    // Auto-create webpack externals for any dependency listed as a peerDependency in package.json
    // so that the external vendor JavaScript is not part of our compiled bundle
    new PeerDepsExternalsPlugin(),

    // Do not emit compiled assets that include errors
    new webpack.NoEmitOnErrorsPlugin(),

    // Configure Extract Plugin for dependent global styles into a single CSS file
    new ExtractTextPlugin({
        filename: 'assets/css/index.css',
        allChunks: true,
        ignoreOrder: true // When using CSS modules import order of CSS no longer needs to be preserved
    }),

    // Defines global variables
    new webpack.DefinePlugin(GLOBALS),

    // Creates HTML page for us at build time
    new HtmlWebpackPlugin(),

    // An ES6+ aware minifier, results in smaller output compared to UglifyJS given that 
    // Chromium in electron supports the majority of ES6 features out of the box.
    new MinifyPlugin()
  ],
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false
  }
};
