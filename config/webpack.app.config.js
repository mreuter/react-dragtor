'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(baseDir) {
  return function(env = 'production') {
    return {
      mode: env,
      entry: [
        require.resolve('./webpack/polyfills'),
        './src/index.js',
      ],
      output: {
        path: path.resolve(baseDir, '../build'),
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
      },
      module: {
        strictExportPresence: true,
        rules: [
          require('./webpack/md-rules-js')(env, baseDir, MiniCssExtractPlugin),
          require('./webpack/babel-rules')(env, baseDir),
          require('./webpack/css-rules')(env, baseDir, MiniCssExtractPlugin),
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({
          inject: true,
          template: 'public/index.html',
          minify: env === 'production'
            ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
            : {},
        }),
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'css/[name].[chunkhash:8].css',
          chunkFilename: 'css/[name].[chunkhash:8].chunk.css',
        }),
      ],
      devtool: env === 'development' ? 'eval-source-map' : undefined,
      devServer: {
        contentBase: path.resolve(baseDir, '../build'),
        compress: true,
        port: 3000,
      },
      // Some libraries import Node modules but don't use them in the browser.
      // Tell Webpack to provide empty mocks for them so importing them works.
      node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      },
    };
  };
};
