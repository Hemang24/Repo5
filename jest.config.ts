import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { strict: false } }],
  },
  moduleNameMapper: {
    // Root-level (weighted-decision-matrix) aliases
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    // Reflect journal app aliases — src/
    '^@reflect/(.*)$': '<rootDir>/src/$1',
    // ASAPPT website — the @/ alias used inside asappt-website/src resolves to that subtree
    '^@/types/(.*)$': '<rootDir>/asappt-website/src/types/$1',
    '^@/app/(.*)$': '<rootDir>/asappt-website/src/app/$1',
    '^@asappt/(.*)$': '<rootDir>/asappt-website/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'src/lib/**/*.ts',
    'src/hooks/**/*.ts',
    'asappt-website/src/lib/**/*.ts',
    'app/api/**/route.ts',
    'src/app/api/**/route.ts',
    'asappt-website/src/app/api/**/route.ts',
    '!**/*.d.ts',
  ],
  coverageReporters: ['text', 'lcov'],
}

export default config
