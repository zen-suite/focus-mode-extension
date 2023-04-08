import { type ManifestV3Export } from '@crxjs/vite-plugin'

export const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Zen mode',
  description: 'An extension for blocking websites to keep you in zen.',
  version: '0.0.1',
  action: {
    default_popup: 'index.html',
  },
  options_page: 'src/options/index.html',
  icons: {
    16: 'logo.png',
    48: 'logo.png',
    128: 'logo.png',
  },
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  web_accessible_resources: [
    {
      resources: ['public/*.jpg', 'public/*.html'],
      matches: ['*://*/*'],
    },
  ],
  host_permissions: ['<all_urls>'],
  permissions: ['activeTab', 'declarativeNetRequest', 'tabs'],
}
