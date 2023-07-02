import { differenceBy, uniqBy } from 'lodash'
import { getStorageInstance } from '../../storage'
import {
  addBlockedSite,
  getBlockedSites,
  removeBlockedSite,
  type IBlockedSite,
  findBlockedSiteByDomain,
} from './block-site'

export const BLOCKED_SITE_TABLE_NAME = 'BLOCKED_SITES'

export interface IBlockedSiteSchema {
  enableBlocking: boolean
  blockedSites: IBlockedSite[]
}

export const initialBlockedSiteSchema: IBlockedSiteSchema = {
  enableBlocking: true,
  blockedSites: [],
}

function getUniqueSites(blockedSites: IBlockedSite[]): IBlockedSite[] {
  return uniqBy(blockedSites, (site) => site.domain)
}

function getBlockedSiteStorageInstance() {
  return getStorageInstance(BLOCKED_SITE_TABLE_NAME, initialBlockedSiteSchema)
}

export class BlockSiteStorage {
  constructor(
    private readonly storageInstance: ReturnType<
      typeof getBlockedSiteStorageInstance
    >
  ) {}

  async enableSitesBlock() {
    await this.syncBlockedSites()
  }

  async disableSitesBlock() {
    const schema = await this.storageInstance.get()
    const blockedSites = await getBlockedSites()
    const uniqueSites = getUniqueSites([
      ...(schema?.blockedSites ?? []),
      ...blockedSites,
    ])
    await Promise.all(
      uniqueSites.map(async (site) => {
        await removeBlockedSite(site.domain)
      })
    )
  }

  async toggleSitesBlock(enable: boolean) {
    await this.storageInstance.update('enableBlocking', enable)
  }

  async getEnableBlocking(): Promise<boolean> {
    const schema = await this.storageInstance.get()
    return schema?.enableBlocking ?? true
  }

  async addBlockSite(site: string) {
    await addBlockedSite(site)
    const blockedSite = await findBlockedSiteByDomain(site)
    if (!blockedSite) {
      return
    }
    const schema = await this.storageInstance.get()
    await this.storageInstance.update('blockedSites', [
      ...(schema?.blockedSites ?? []),
      blockedSite,
    ])
    if (schema?.enableBlocking !== undefined && !schema.enableBlocking) {
      await this.disableSitesBlock()
    }
  }

  async getBlockedSites(): Promise<IBlockedSite[]> {
    const schema = await this.storageInstance.get()
    return schema?.blockedSites ?? []
  }

  async get(): Promise<IBlockedSiteSchema> {
    return (await this.storageInstance.get()) ?? initialBlockedSiteSchema
  }

  async removeBlockedSite(domain: string) {
    await removeBlockedSite(domain)
    const schema = await this.storageInstance.get()
    const blockedSites = schema?.blockedSites.filter(
      (site) => site.domain !== domain
    )
    await this.storageInstance.update('blockedSites', blockedSites ?? [])
  }

  async syncBlockedSites() {
    const allBlockedSites = await getBlockedSites()
    const storedBlockedSite = await this.storageInstance.get()
    const finalBlockedSites = getUniqueSites([
      ...allBlockedSites,
      ...(storedBlockedSite?.blockedSites ?? []),
    ])

    await this.storageInstance.update('blockedSites', finalBlockedSites)

    const blockedSitesToAdd = differenceBy(
      finalBlockedSites,
      allBlockedSites,
      (site) => site.domain
    )

    await Promise.all(
      blockedSitesToAdd.map(async (blockedSite) => {
        await addBlockedSite(blockedSite.domain)
      })
    )
  }
}

let blockSiteStorage: BlockSiteStorage

export function getBlockSiteStorage() {
  if (!blockSiteStorage) {
    blockSiteStorage = new BlockSiteStorage(getBlockedSiteStorageInstance())
  }
  return blockSiteStorage
}
