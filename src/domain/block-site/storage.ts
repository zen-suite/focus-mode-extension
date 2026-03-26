import { differenceBy, uniqBy } from 'lodash'
import dayjs from 'dayjs'
import { getStorageInstance } from '../../storage'
import {
  addBlockedSite,
  batchAddBlockedSites,
  filterBlockedSitesByDomain,
  getBlockedSites,
  removeBlockedSite,
  type IBlockedSite,
} from './block-site'
import { POMODORO_ALARM, TAKE_A_BREAK_ALARM } from './constants'

export const BLOCKED_SITE_TABLE_NAME = 'BLOCKED_SITES'
export const DEFAULT_POMODORO_FOCUS_DURATION_MINUTES = 25
export const DEFAULT_POMODORO_BREAK_DURATION_MINUTES = 5

export enum PomodoroPhase {
  FOCUS = 'FOCUS',
  BREAK = 'BREAK',
}

export interface IPomodoroState {
  isActive: boolean
  phase: PomodoroPhase
  focusDurationMinutes: number
  breakDurationMinutes: number
  phaseEndsAt?: string
}

export interface IBlockedSiteSchema {
  enableBlocking: boolean
  blockedSites: IBlockedSite[]
  breakUntil?: string
  pomodoro: IPomodoroState
}

export const initialBlockedSiteSchema: IBlockedSiteSchema = {
  enableBlocking: true,
  blockedSites: [],
  pomodoro: {
    isActive: false,
    phase: PomodoroPhase.FOCUS,
    focusDurationMinutes: DEFAULT_POMODORO_FOCUS_DURATION_MINUTES,
    breakDurationMinutes: DEFAULT_POMODORO_BREAK_DURATION_MINUTES,
  },
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

  private async applySitesBlock(enable: boolean) {
    if (enable) {
      await this.enableSitesBlock()
      return
    }
    await this.disableSitesBlock()
  }

  async toggleSitesBlock(enable: boolean) {
    await this.storageInstance.update('enableBlocking', enable)
    await this.applySitesBlock(enable)
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
    const schema = await this.storageInstance.get()
    if (schema?.pomodoro.isActive) {
      return
    }
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

  async getPomodoro(): Promise<IPomodoroState> {
    const schema = await this.get()
    return schema.pomodoro
  }

  async updatePomodoroDurations({
    focusDurationMinutes,
    breakDurationMinutes,
  }: {
    focusDurationMinutes: number
    breakDurationMinutes: number
  }) {
    const pomodoro = await this.getPomodoro()
    await this.update('pomodoro', {
      ...pomodoro,
      focusDurationMinutes,
      breakDurationMinutes,
    })
  }

  async startPomodoro() {
    const pomodoro = await this.getPomodoro()
    const phaseEndsAt = dayjs()
      .add(pomodoro.focusDurationMinutes, 'minute')
      .toISOString()

    await chrome.alarms.clear(TAKE_A_BREAK_ALARM)
    await this.update('breakUntil', undefined)
    await this.update('pomodoro', {
      ...pomodoro,
      isActive: true,
      phase: PomodoroPhase.FOCUS,
      phaseEndsAt,
    })
    await chrome.alarms.create(POMODORO_ALARM, {
      when: dayjs(phaseEndsAt).valueOf(),
    })
    await this.applySitesBlock(true)
  }

  async stopPomodoro() {
    const schema = await this.get()
    await chrome.alarms.clear(POMODORO_ALARM)
    await this.update('pomodoro', {
      ...schema.pomodoro,
      isActive: false,
      phase: PomodoroPhase.FOCUS,
      phaseEndsAt: undefined,
    })
    await this.applySitesBlock(schema.enableBlocking)
  }

  async transitionPomodoroPhase() {
    const pomodoro = await this.getPomodoro()
    if (!pomodoro.isActive) {
      return pomodoro
    }

    const nextPhase =
      pomodoro.phase === PomodoroPhase.FOCUS
        ? PomodoroPhase.BREAK
        : PomodoroPhase.FOCUS
    const durationMinutes =
      nextPhase === PomodoroPhase.FOCUS
        ? pomodoro.focusDurationMinutes
        : pomodoro.breakDurationMinutes
    const phaseEndsAt = dayjs().add(durationMinutes, 'minute').toISOString()
    const nextPomodoro = {
      ...pomodoro,
      phase: nextPhase,
      phaseEndsAt,
    }

    await this.update('pomodoro', nextPomodoro)
    await chrome.alarms.create(POMODORO_ALARM, {
      when: dayjs(phaseEndsAt).valueOf(),
    })
    await this.applySitesBlock(nextPhase === PomodoroPhase.FOCUS)

    return nextPomodoro
  }

  async syncPomodoroWithNow() {
    const pomodoro = await this.getPomodoro()
    if (!pomodoro.isActive || !pomodoro.phaseEndsAt) {
      return pomodoro
    }

    const now = dayjs()
    const currentPhaseDuration =
      pomodoro.phase === PomodoroPhase.FOCUS
        ? pomodoro.focusDurationMinutes
        : pomodoro.breakDurationMinutes
    const oppositePhase =
      pomodoro.phase === PomodoroPhase.FOCUS
        ? PomodoroPhase.BREAK
        : PomodoroPhase.FOCUS
    const oppositePhaseDuration =
      oppositePhase === PomodoroPhase.FOCUS
        ? pomodoro.focusDurationMinutes
        : pomodoro.breakDurationMinutes
    const currentPhaseStart = dayjs(pomodoro.phaseEndsAt).subtract(
      currentPhaseDuration,
      'minute'
    )
    const elapsedMinutes = now.diff(currentPhaseStart, 'minute', true)

    if (elapsedMinutes <= 0) {
      await chrome.alarms.create(POMODORO_ALARM, {
        when: dayjs(pomodoro.phaseEndsAt).valueOf(),
      })
      await this.applySitesBlock(pomodoro.phase === PomodoroPhase.FOCUS)
      return pomodoro
    }

    const cycleDuration = currentPhaseDuration + oppositePhaseDuration
    const nextPomodoro = { ...pomodoro }

    if (elapsedMinutes < currentPhaseDuration) {
      nextPomodoro.phase = pomodoro.phase
      nextPomodoro.phaseEndsAt = currentPhaseStart
        .add(currentPhaseDuration, 'minute')
        .toISOString()
    } else {
      const offsetAfterCurrentPhase =
        (elapsedMinutes - currentPhaseDuration) % cycleDuration

      if (offsetAfterCurrentPhase < oppositePhaseDuration) {
        nextPomodoro.phase = oppositePhase
        nextPomodoro.phaseEndsAt = now
          .add(oppositePhaseDuration - offsetAfterCurrentPhase, 'minute')
          .toISOString()
      } else {
        const elapsedInCurrentPhase =
          offsetAfterCurrentPhase - oppositePhaseDuration
        nextPomodoro.phase = pomodoro.phase
        nextPomodoro.phaseEndsAt = now
          .add(currentPhaseDuration - elapsedInCurrentPhase, 'minute')
          .toISOString()
      }
    }

    await this.update('pomodoro', nextPomodoro)
    await chrome.alarms.create(POMODORO_ALARM, {
      when: dayjs(nextPomodoro.phaseEndsAt).valueOf(),
    })
    await this.applySitesBlock(nextPomodoro.phase === PomodoroPhase.FOCUS)
    return nextPomodoro
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
