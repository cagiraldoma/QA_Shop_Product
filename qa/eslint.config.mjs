import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  playwright.configs['flat/recommended'],
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'warn',
      'playwright/no-networkidle': 'off',
      'playwright/expect-expect': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'test-results/', 'playwright-report/', 'allure-results/', 'allure-report/'],
  },
);
