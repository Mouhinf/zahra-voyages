// Flat ESLint config that loads plugins and basic recommended rules so ESLint v9 can run in CI
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const hooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  { ignores: ['.next/', 'node_modules/'] },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': hooksPlugin
    },
    rules: {
      'no-console': 'off',
      // include recommended rules from @typescript-eslint
      ...tsPlugin.configs.recommended.rules
    },
    settings: {
      react: { version: 'detect' }
    }
  }
];
