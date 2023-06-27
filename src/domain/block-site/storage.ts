import { getStorageInstance, requestStoragePermission } from '../../storage'
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
  const storageAllowed = await requestStoragePermission()
  console.log("🚀 ~ file: storage.ts:19 ~ syncBlockSites ~ storageAllowed:", storageAllowed)
  if (!storageAllowed) {
    throw new NotEnoughPermissionError('storage')
  }
  const allBlockedSites = await getBlockedSites()
  const storageArea = getBlockedSiteStorageInstance()
  await storageArea.set({
    ...initialBlockedSiteSchema,
    blockedSites: allBlockedSites,
  })
}

export function getBlockedSiteStorageInstance() {
  return getStorageInstance(BLOCKED_SITE_TABLE_NAME, initialBlockedSiteSchema)
}
