module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@assets': './src/assets',
          '@config': './src/config',
          '@': './src',
        },
      },
    ],
    'react-native-reanimated/plugin',
    'module:react-native-dotenv',
  ],
};
