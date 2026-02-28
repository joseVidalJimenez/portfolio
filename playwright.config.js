// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './tests/results',
  snapshotDir: './tests/screenshots',

  // Each test gets up to 30 seconds
  timeout: 30_000,

  // Show full diff on screenshot mismatch
  expect: { timeout: 5_000 },

  // Run tests in parallel (one worker per page × viewport combo)
  fullyParallel: true,
  workers: 4,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/report', open: 'never' }],
  ],

  use: {
    // Serve the docs/ folder via a local static server
    baseURL: 'http://localhost:5500',

    // Always capture screenshots and traces on failure
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  // Spin up Python's built-in HTTP server during test runs
  webServer: {
    command: 'python3 -m http.server 5500 --directory docs',
    url: 'http://localhost:5500',
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
