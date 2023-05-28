import { type ManifestV3Export } from '@crxjs/vite-plugin'

export const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Zen mode - Block distraction',
  description: 'An extension for blocking websites to keep you in zen mode',
  version: process.env.npm_package_version,
  action: {
    default_popup: 'index.html',
  },
  options_page: 'src/options/index.html',
  icons: {
    128: 'logo.png',
  },
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  web_accessible_resources: [
    {
      resources: ['public/*.jpg', 'src/blocked/**'],
      matches: ['*://*/*'],
    },
  ],
  permissions: ['activeTab', 'declarativeNetRequest', 'tabs'],
}
