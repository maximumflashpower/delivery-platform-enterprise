import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapping: {
    '^@common/(.*)$': '<rootDir>/src/common/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: { branches: 0, functions: 0, lines: 0, statements: 0 },
  },
  testTimeout: 30000,
};

export default config;
