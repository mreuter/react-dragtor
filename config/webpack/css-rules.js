'use strict';

const loaders = function(env, MiniCssExtractPlugin) {
  return [
    env === 'production'
      ? {
        loader: MiniCssExtractPlugin.loader,
      }
      : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        config: {
          path: './config/'
        },
      },
    },
  ];
};

module.exports = function(env, baseDir, MiniCssExtractPlugin) {
  return {
    test: /\.css$/,
    use: loaders(env, MiniCssExtractPlugin)
  };
};
module.exports.loaders = loaders;
