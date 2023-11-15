/** @type {import('jest').Config} */
const config = {
  roots: [
    '<rootDir>/src'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverage: true,
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}

module.exports = config
