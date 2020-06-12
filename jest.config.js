module.exports = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  collectCoverage: false,
  coveragePathIgnorePatterns: ['<rootDir>/test/', '<rootDir>/node_modules'],
  collectCoverage: false,
  coverageReporters: ['json', 'html', 'text'],
  coverageDirectory: 'coverage',
}
