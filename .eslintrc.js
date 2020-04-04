module.exports = {
  env: {
    browser: true,
    es6: true,
    "jest/globals": true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: [
    "react",
    "jest"
  ],
  rules: {
    "no-console": "warn",
    "react/jsx-filename-extension": 0,
    "quotes": ["error","double"],
    "no-prototype-builtins": ["warn"],
    "no-param-reassign": ["warn"]
  },
};
