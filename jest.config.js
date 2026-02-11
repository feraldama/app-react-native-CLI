module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-toast-message|@react-navigation|react-redux|@reduxjs|immer)/)',
  ],
  moduleNameMapper: {
    '^react-native-toast-message$': '<rootDir>/__mocks__/react-native-toast-message.js',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/async-storage.js',
  },
};
