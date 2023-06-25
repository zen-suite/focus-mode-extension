import { syncBlockSites } from '../domain/block-site'
import { isStorageAllowed } from '../storage'
chrome.runtime.onInstalled.addListener(async () => {
  const storageGranted = await isStorageAllowed()
  if (storageGranted) {
    await syncBlockSites()
  }
})
