module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'eslint:recommended',
  ],
  rules: {
    'no-undef': 'off',
    'vue/max-attributes-per-line': 'off',
  },
};
