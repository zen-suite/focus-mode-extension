import { getStorageInstance, isStorageAllowed } from '../../storage'
import { getBlockedSites, type IBlockedSite } from './block-site'
import { NotEnoughPermissionError } from './errors'

export const BLOCKED_SITE_TABLE_NAME = 'BLOCKED_SITES'

export interface IBlockedSiteSchema {
  enableBlocking: boolean
  blockedSites: IBlockedSite[]
}

export const initialBlockedSiteSchema: IBlockedSiteSchema = {
  enableBlocking: true,
  blockedSites: [],
}

export async function syncBlockSites() {
  const storageAllowed = await isStorageAllowed()
  if (!storageAllowed) {
    throw new NotEnoughPermissionError('storage')
  }
  const allBlockedSites = await getBlockedSites()
  const storageArea = getStorageInstance(
    BLOCKED_SITE_TABLE_NAME,
    initialBlockedSiteSchema
  )
  await storageArea.set({
    ...initialBlockedSiteSchema,
    blockedSites: allBlockedSites,
  })
}
