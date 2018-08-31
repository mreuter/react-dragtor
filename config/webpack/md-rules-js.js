'use strict';

const multi = require('multi-loader');
const combineLoaders = require('webpack-combine-loaders');
const cssLoaders = require('./css-rules').loaders;

module.exports = function(env, baseDir, MiniCssExtractPlugin) {
  return {
    test: /\.(md)$/,
    loader: multi(
      combineLoaders([]
        .concat(cssLoaders(env, MiniCssExtractPlugin))
        .concat([
          { loader: require.resolve('./example-loader.js'), options: {capture: 'language-css'}},
          'markdown-loader',
        ])
      ),
      combineLoaders([
        'babel-loader',
        { loader: require.resolve('./example-loader.js'), options: {capture: 'language-javascript'}},
        'markdown-loader',
      ]),
    ),
  };
};
