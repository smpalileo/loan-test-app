// jest.config.js
module.exports = {
  preset: "ts-jest", // This is crucial for TypeScript
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  clearMocks: true,
};
