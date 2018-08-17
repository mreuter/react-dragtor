module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.{js}',
    '!packages/*/lib/**',
    '!**/node_modules/**',
  ],
  roots: [
    'packages/',
    'examples/',
  ]
};
