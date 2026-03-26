import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  BlockSiteStorage,
  PomodoroPhase,
  initialBlockedSiteSchema,
} from './storage'

const {
  batchAddBlockedSites,
  filterBlockedSitesByDomain,
  getBlockedSites,
  removeBlockedSite,
} = vi.hoisted(() => ({
  batchAddBlockedSites: vi.fn(),
  filterBlockedSitesByDomain: vi.fn(async () => []),
  getBlockedSites: vi.fn(async () => []),
  removeBlockedSite: vi.fn(async () => {}),
}))

vi.mock('./block-site', () => ({
  addBlockedSite: vi.fn(),
  batchAddBlockedSites,
  filterBlockedSitesByDomain,
  getBlockedSites,
  removeBlockedSite,
}))

describe(BlockSiteStorage, () => {
  let schema = structuredClone(initialBlockedSiteSchema)

  const storageInstance = {
    get: vi.fn(async () => schema),
    update: vi.fn(async (key: keyof typeof schema, value: unknown) => {
      schema = {
        ...schema,
        [key]: value,
      }
    }),
  }

  beforeEach(() => {
    schema = structuredClone(initialBlockedSiteSchema)
    storageInstance.get.mockClear()
    storageInstance.update.mockClear()
    batchAddBlockedSites.mockReset()
    batchAddBlockedSites.mockResolvedValue(undefined)
    filterBlockedSitesByDomain.mockReset()
    filterBlockedSitesByDomain.mockResolvedValue([])
    getBlockedSites.mockReset()
    getBlockedSites.mockResolvedValue([])
    removeBlockedSite.mockReset()
    removeBlockedSite.mockResolvedValue(undefined)
    global.chrome = {
      alarms: {
        clear: vi.fn(async () => true),
        create: vi.fn(async () => {}),
      },
    } as unknown as typeof chrome
  })

  it('starting pomodoro stores active focus state and clears breakUntil', async () => {
    schema.breakUntil = '2026-03-26T12:00:00.000Z'
    const storage = new BlockSiteStorage(storageInstance as never)

    await storage.startPomodoro()

    expect(schema.breakUntil).toBeUndefined()
    expect(schema.pomodoro.isActive).toBe(true)
    expect(schema.pomodoro.phase).toBe(PomodoroPhase.FOCUS)
    expect(schema.pomodoro.phaseEndsAt).toBeTruthy()
    expect(chrome.alarms.clear).toHaveBeenCalled()
    expect(chrome.alarms.create).toHaveBeenCalled()
  })

  it('stopping pomodoro restores blocking according to enableBlocking', async () => {
    const storage = new BlockSiteStorage(storageInstance as never)
    const applySitesBlock = vi
      .spyOn(storage as any, 'applySitesBlock')
      .mockResolvedValue(undefined)

    storageInstance.get.mockResolvedValueOnce({
      ...structuredClone(initialBlockedSiteSchema),
      enableBlocking: false,
      pomodoro: {
        ...structuredClone(initialBlockedSiteSchema).pomodoro,
        isActive: true,
        phase: PomodoroPhase.FOCUS,
        phaseEndsAt: '2026-03-26T12:25:00.000Z',
      },
    })

    await storage.stopPomodoro()

    expect(storageInstance.update).toHaveBeenCalledWith('pomodoro', {
      ...structuredClone(initialBlockedSiteSchema).pomodoro,
      isActive: false,
      phase: PomodoroPhase.FOCUS,
      phaseEndsAt: undefined,
    })
    expect(applySitesBlock).toHaveBeenCalledWith(false)
  })

  it('transitioning pomodoro phase flips and updates phase end time', async () => {
    const storage = new BlockSiteStorage(storageInstance as never)
    const applySitesBlock = vi
      .spyOn(storage as any, 'applySitesBlock')
      .mockResolvedValue(undefined)

    vi.spyOn(storage, 'getPomodoro').mockResolvedValue({
      ...structuredClone(initialBlockedSiteSchema).pomodoro,
      isActive: true,
      phase: PomodoroPhase.FOCUS,
      phaseEndsAt: '2026-03-26T12:25:00.000Z',
    })

    const nextPomodoro = await storage.transitionPomodoroPhase()

    expect(nextPomodoro?.phase).toBe(PomodoroPhase.BREAK)
    expect(nextPomodoro?.phaseEndsAt).toBeTruthy()
    expect(chrome.alarms.create).toHaveBeenCalled()
    expect(applySitesBlock).toHaveBeenCalledWith(false)
  })
})
