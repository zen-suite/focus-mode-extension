import React from 'react'
import ReactDOM from 'react-dom'
import { getBlockSiteStorage } from '../domain/block-site'
import { extractDomain } from '../util/host'
import Content from './Content'
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

  ReactDOM.render(
    <React.StrictMode>
      <Content />
    </React.StrictMode>,
    contentRoot
  )
})()
