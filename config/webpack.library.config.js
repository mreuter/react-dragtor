'use strict';

const path = require('path');
const babelRules = require('./webpack/babel-rules');

module.exports = function(baseDir) {
  return function(env = 'production') {
    return {
      mode: env,
      entry: './src/index.js',
      output: {
        library: 'react-dragtor',
        libraryTarget: env === 'development' ? 'umd' : 'commonjs2',
        path: path.resolve(baseDir, '../lib'),
        filename: 'index.js',
      },
      module: {
        strictExportPresence: true,
        rules: [
          babelRules(env, baseDir),
        ],
      },
      externals: {
        react: {
          commonjs: "react",
          commonjs2: "react",
          amd: "React",
          root: "React"
        },
      },
      devtool: env === 'development' ? 'eval-source-map': undefined,
    };
  };
};
