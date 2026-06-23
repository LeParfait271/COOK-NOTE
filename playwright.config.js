const { defineConfig, devices } = require('@playwright/test');

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '127.0.0.1';
const BASE_URL = process.env.COOK_NOTE_BASE_URL || `http://${HOST}:${PORT}`;
const SKIP_WEBSERVER = process.env.COOK_NOTE_SKIP_WEBSERVER === '1';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: {
    timeout: 12000
  },
  fullyParallel: false,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  outputDir: 'test-results',
  use: {
    baseURL: BASE_URL,
    actionTimeout: 10000,
    navigationTimeout: 20000,
    serviceWorkers: 'block',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  webServer: SKIP_WEBSERVER ? undefined : {
    command: `node server.js`,
    url: BASE_URL,
    timeout: 30000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      HOST,
      PORT: String(PORT)
    }
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 900 }
      }
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 }
      }
    }
  ]
});
