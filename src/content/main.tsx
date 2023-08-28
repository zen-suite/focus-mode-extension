import React from 'react'
import { createRoot } from 'react-dom/client'
import { getBlockSiteStorage } from '../domain/block-site'
import AppThemeProvider from '../providers/AppThemeProvider'
import { extractDomain } from '../util/host'
import { Content } from './Content'
;(async () => {
  const storage = getBlockSiteStorage()
  const currentDomain = extractDomain(window.location.href).replace('www.', '')
  if (!currentDomain) {
    return
  }
  const blockedSites = await storage.getBlockedSites()
  const foundBlockSite = blockedSites.find(
    (blockedSite) => blockedSite.domain === currentDomain
  )
  if (!foundBlockSite) {
    return
  }
  const contentRoot = document.createElement('div')
  contentRoot.id = 'zen-mode-content-root'
  document.body.append(contentRoot)
  const root = createRoot(contentRoot, {
    identifierPrefix: 'zen-mode',
  })

  root.render(
    <React.StrictMode>
      <AppThemeProvider>
        <Content />
      </AppThemeProvider>
    </React.StrictMode>
  )
})()
