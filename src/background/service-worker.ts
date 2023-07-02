import { getBlockSiteStorage } from '../domain/block-site'
chrome.runtime.onInstalled.addListener(async () => {
  await getBlockSiteStorage().syncBlockedSites()
})
