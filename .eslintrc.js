module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    indent: ['error', 2],
    'no-unused-private-class-members': ['warn'],
    'no-duplicate-imports': ['error'],
    'no-new': ['off'],
    'no-bitwise': ['off'],
    'no-alert': ['off'],
    'global-require': ['off'],
    'no-use-before-define': ['off'],
    'import/prefer-default-export': ['off'],
    'import/extensions': ['off'],
    'no-unused-vars': ['off'],
    'no-param-reassign': ['off'],
    'import/no-cycle': ['off'],
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react+(|-native)',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '.',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
