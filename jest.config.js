module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    // testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    // transform: {
    //   '^.+\\.tsx?$': 'ts-jest',
    // },
    // globals: {
    //   'ts-jest': {
    //     tsconfig: 'tsconfig.json'
    //   }
    // },
    moduleNameMapper: {
        '^@api/(.*)$': '<rootDir>/src/api/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@nexbottypes/(.*)$': '<rootDir>/src/types/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@functions/(.*)$': '<rootDir>/src/functions/$1',
        '^@providers/(.*)$': '<rootDir>/src/providers/$1',
        '^@slices/(.*)$': '<rootDir>/src/slices/$1',
        '^@nexbot/(.*)$': '<rootDir>/src/$1'
      },


  };
  