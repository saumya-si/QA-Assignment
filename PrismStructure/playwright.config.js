import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import './config/env.config.js';
import { env } from './config/env.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(__dirname, 'reports/html'), open: 'never' }],
    ['json', { outputFile: path.join(__dirname, 'reports/json/results.json') }],
  ],

  use: {
    baseURL: env.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: path.join(__dirname, 'test-results'),
});
