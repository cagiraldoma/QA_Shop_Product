import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  outputDir: 'test-results',
  reporter: process.env.CI
    ? [
        ['list'],
        ['allure-playwright'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['./src/utils/ci-reporter.ts'],
      ]
    : [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'http://localhost/',
    headless: true,
  },
  metadata: {
    env: process.env.ENV || 'dev',
    suite: 'qa-practice-product',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    {
      name: 'api',
      use: {},
      testMatch: 'tests/api/**/*.spec.ts',
    },
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: 'tests/visual/**/*.spec.ts',
    },
    {
      name: 'smoke',
      use: { ...devices['Desktop Chrome'] },
      testMatch: 'tests/smoke/**/*.spec.ts',
    },
  ],
  globalSetup: require.resolve('./src/setup/global-setup'),
  globalTeardown: require.resolve('./src/setup/global-teardown'),
});
