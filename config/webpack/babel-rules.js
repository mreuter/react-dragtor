'use strict';

const path = require('path');

module.exports = function(env, baseDir) {
  return {
    // Use babel for javascript
    test: /\.(js|mjs|jsx)$/,
    include: path.resolve(baseDir, '../src'),
    loader: 'babel-loader',
  };
};
