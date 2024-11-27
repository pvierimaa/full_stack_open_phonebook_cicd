import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3001',
    timeout: 180 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3001',
  },
})
