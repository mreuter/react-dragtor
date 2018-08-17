module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/packages/react-dragtor/src/**/*.test.js'
  ],
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
  ],
  modulePaths: [
    '<rootDir>/node_modules',
  ],
  collectCoverage: true,
  coverageReporters: ['html', 'lcov'],
  "projects": ["<rootDir>/packages/*", "<rootDir>/examples/*"]
};
