import { differenceBy, uniqBy } from 'lodash'
import { getStorageInstance } from '../../storage'
import {
  addBlockedSite,
  batchAddBlockedSites,
  filterBlockedSitesByDomain,
  getBlockedSites,
  removeBlockedSite,
  type IBlockedSite,
} from './block-site'
import { TAKE_A_BREAK_ALARM } from './constants'

export const BLOCKED_SITE_TABLE_NAME = 'BLOCKED_SITES'

export interface IBlockedSiteSchema {
  enableBlocking: boolean
  blockedSites: IBlockedSite[]
  breakUntil?: string
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

  private async enableSitesBlock() {
    await this.syncBlockedSites()
    await this.update('breakUntil', undefined)
  }

  private async disableSitesBlock() {
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
    if (enable) {
      await this.enableSitesBlock()
    } else {
      await this.disableSitesBlock()
    }
  }

  async getEnableBlocking(): Promise<boolean> {
    const schema = await this.storageInstance.get()
    return schema?.enableBlocking ?? true
  }

  async addBlockSite(site: string) {
    await addBlockedSite(site)
    const blockedSites = await filterBlockedSitesByDomain(site)
    const schema = await this.storageInstance.get()
    await this.storageInstance.update(
      'blockedSites',
      getUniqueSites([...(schema?.blockedSites ?? []), ...blockedSites])
    )
    if (schema?.enableBlocking !== undefined && !schema.enableBlocking) {
      await this.toggleSitesBlock(false)
    }
  }

  async setBreakTime(breakTime: Date) {
    await this.storageInstance.update('breakUntil', breakTime.toISOString())
    await chrome.alarms.create(TAKE_A_BREAK_ALARM, {
      when: breakTime.getTime(),
    })
    await this.toggleSitesBlock(false)
  }

  async getBlockedSites(): Promise<IBlockedSite[]> {
    const schema = await this.storageInstance.get()
    return schema?.blockedSites ?? []
  }

  async get(): Promise<IBlockedSiteSchema> {
    return (await this.storageInstance.get()) ?? initialBlockedSiteSchema
  }

  async update<K extends keyof IBlockedSiteSchema>(
    field: K,
    data: IBlockedSiteSchema[K]
  ) {
    await this.storageInstance.update(field, data)
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
    const existingBlockedSites = await getBlockedSites()
    const storedBlockedSite = await this.storageInstance.get()
    const finalBlockedSites = getUniqueSites([
      ...existingBlockedSites,
      ...(storedBlockedSite?.blockedSites ?? []),
    ])

    const blockedSitesToAdd = differenceBy(
      finalBlockedSites,
      existingBlockedSites,
      (site) => site.domain
    )

    await batchAddBlockedSites(blockedSitesToAdd.map((site) => site.domain))
    await this.storageInstance.update('blockedSites', await getBlockedSites())
  }
}

let blockSiteStorage: BlockSiteStorage

export function getBlockSiteStorage() {
  if (!blockSiteStorage) {
    blockSiteStorage = new BlockSiteStorage(getBlockedSiteStorageInstance())
  }
  return blockSiteStorage
}
