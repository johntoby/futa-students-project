import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js", "frontend/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        Buffer: "readonly",
        global: "readonly",
        exports: "writable"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "semi": ["error", "always"],
      "quotes": ["error", "single"]
    }
  }
];