import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.mjs',
  fullyParallel: true,
  workers: 2,
  use: { browserName: 'chromium', headless: true },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: 'http://127.0.0.1:4175',
    env: { PORT: '4175' },
    reuseExistingServer: !process.env.CI
  }
});
