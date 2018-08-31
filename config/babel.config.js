module.exports = function(api) {
  api.cache(false);

  return {
    presets: [
      '@babel/env',
      '@babel/react',
      '@babel/flow',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
    ],
  };
};
