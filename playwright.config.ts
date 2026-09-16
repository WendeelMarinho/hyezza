import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
// Usa o Chrome instalado quando disponivel (PW_CHANNEL=chrome); na CI, o Chromium do Playwright.
const channel = process.env.PW_CHANNEL
// E2E_BASE_URL=https://hyezza.vercel.app testa o site publicado em vez do build local.
const remoteUrl = process.env.E2E_BASE_URL

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: remoteUrl ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel, viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel, viewport: { width: 390, height: 844 } } },
  ],
  webServer: remoteUrl
    ? undefined
    : {
        command: `npx --yes serve@14 out -l ${PORT} --no-clipboard`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
      },
})
