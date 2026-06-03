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

  const storageInstance: {
    get: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
  } = {
    get: vi.fn(),
    update: vi.fn(),
  }

  beforeEach(() => {
    schema = structuredClone(initialBlockedSiteSchema)
    storageInstance.get = vi.fn(async () => schema)
    storageInstance.update = vi.fn(
      async (key: keyof typeof schema, value: unknown) => {
        schema = {
          ...schema,
          [key]: value,
        }
      }
    )
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

    const previousGet = storageInstance.get
    storageInstance.get = vi.fn(async () => ({
      ...structuredClone(initialBlockedSiteSchema),
      enableBlocking: false,
      pomodoro: {
        ...structuredClone(initialBlockedSiteSchema).pomodoro,
        isActive: true,
        phase: PomodoroPhase.FOCUS,
        phaseEndsAt: '2026-03-26T12:25:00.000Z',
      },
    }))

    await storage.stopPomodoro()

    storageInstance.get = previousGet

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

  it('returns default friction settings', async () => {
    const storage = new BlockSiteStorage(storageInstance as never)

    await expect(storage.getFrictionSettings()).resolves.toEqual({
      enforceStrongFriction: false,
      frictionLevel: 1,
      frictionDisableCount: 0,
      frictionDisablesPerLevel: 5,
    })
  })

  it('persists friction disables per level', async () => {
    const storage = new BlockSiteStorage(storageInstance as never)

    await storage.setFrictionDisablesPerLevel(3)

    expect(storageInstance.update).toHaveBeenCalledWith(
      'frictionDisablesPerLevel',
      3
    )
    expect(await storage.getFrictionSettings()).toMatchObject({
      frictionDisablesPerLevel: 3,
    })
  })

  it('escalates friction level using configured disables per level', async () => {
    schema.frictionDisablesPerLevel = 3
    const storage = new BlockSiteStorage(storageInstance as never)

    for (let index = 0; index < 2; index += 1) {
      await storage.recordFrictionDisableSuccess()
    }
    expect(await storage.getFrictionSettings()).toMatchObject({
      frictionDisableCount: 2,
      frictionLevel: 1,
    })

    await storage.recordFrictionDisableSuccess()
    expect(await storage.getFrictionSettings()).toMatchObject({
      frictionDisableCount: 3,
      frictionLevel: 2,
    })
  })

  it('persists enforce strong friction toggle', async () => {
    const storage = new BlockSiteStorage(storageInstance as never)

    await storage.setEnforceStrongFriction(true)

    expect(storageInstance.update).toHaveBeenCalledWith(
      'enforceStrongFriction',
      true
    )
    expect(await storage.getFrictionSettings()).toMatchObject({
      enforceStrongFriction: true,
    })
  })

  it('escalates friction level after every fifth successful disable', async () => {
    const storage = new BlockSiteStorage(storageInstance as never)

    for (let index = 0; index < 4; index += 1) {
      await storage.recordFrictionDisableSuccess()
    }
    expect(await storage.getFrictionSettings()).toMatchObject({
      frictionDisableCount: 4,
      frictionLevel: 1,
    })

    await storage.recordFrictionDisableSuccess()
    expect(await storage.getFrictionSettings()).toMatchObject({
      frictionDisableCount: 5,
      frictionLevel: 2,
    })

    for (let index = 0; index < 4; index += 1) {
      await storage.recordFrictionDisableSuccess()
    }
    expect(await storage.getFrictionSettings()).toMatchObject({
      frictionDisableCount: 9,
      frictionLevel: 2,
    })

    await storage.recordFrictionDisableSuccess()
    expect(await storage.getFrictionSettings()).toMatchObject({
      frictionDisableCount: 10,
      frictionLevel: 3,
    })
  })
})
