module.exports = {
  extends: ['@student-api/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.cjs', 'src/__tests__/**'],
  overrides: [
    {
      files: ['src/**/*.ts'],
      excludedFiles: ['src/__tests__/**'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
      },
    },
    {
      files: ['src/benchmark.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
