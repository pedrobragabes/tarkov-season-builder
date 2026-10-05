import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', workers: 1, retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:3494', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' },
  webServer: {
    command: process.env.CI === 'true' ? 'npm run start -- --hostname 127.0.0.1 --port 3494' : 'npm run dev -- --hostname 127.0.0.1 --port 3494',
    url: 'http://127.0.0.1:3494', reuseExistingServer: false, timeout: 120000,
  },
});
