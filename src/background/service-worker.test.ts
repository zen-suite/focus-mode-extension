import { beforeEach, describe, expect, it, vi } from 'vitest'

const storage = {
  get: vi.fn(),
  getPomodoro: vi.fn(),
  syncPomodoroWithNow: vi.fn(),
  toggleSitesBlock: vi.fn(),
  transitionPomodoroPhase: vi.fn(),
}

vi.mock('../domain/block-site', async () => {
  const actual = await vi.importActual<typeof import('../domain/block-site')>(
    '../domain/block-site'
  )
  return {
    ...actual,
    getBlockSiteStorage: () => storage,
  }
})

describe('service-worker pomodoro behavior', () => {
  beforeEach(() => {
    vi.resetModules()
    storage.get.mockReset()
    storage.getPomodoro.mockReset()
    storage.syncPomodoroWithNow.mockReset()
    storage.toggleSitesBlock.mockReset()
    storage.transitionPomodoroPhase.mockReset()
    global.chrome = {
      alarms: {
        create: vi.fn(async () => {}),
        onAlarm: { addListener: vi.fn() },
      },
      runtime: {
        onInstalled: { addListener: vi.fn() },
        onStartup: { addListener: vi.fn() },
        onMessage: { addListener: vi.fn() },
      },
      tabs: {
        query: vi.fn(async () => []),
        sendMessage: vi.fn(async () => {}),
      },
    } as unknown as typeof chrome
  })

  it('startup restores active pomodoro state', async () => {
    storage.get.mockResolvedValue({
      pomodoro: {
        isActive: true,
      },
      enableBlocking: true,
    })
    const serviceWorker = await import('./service-worker')

    await serviceWorker.initializeExtension()

    expect(storage.syncPomodoroWithNow).toHaveBeenCalledTimes(1)
    expect(storage.toggleSitesBlock).toHaveBeenCalledTimes(0)
  })

  it('pomodoro alarm advances when the current phase has ended', async () => {
    storage.getPomodoro.mockResolvedValue({
      isActive: true,
      phaseEndsAt: '2020-03-26T12:00:00.000Z',
    })
    const serviceWorker = await import('./service-worker')

    await serviceWorker.processPomodoroAlarm()

    expect(storage.transitionPomodoroPhase).toHaveBeenCalledTimes(1)
  })

  it('break reminder does nothing while pomodoro is active', async () => {
    storage.get.mockResolvedValue({
      pomodoro: { isActive: true },
      breakUntil: '2026-03-26T12:00:00.000Z',
      blockedSites: [{ domain: 'example.com' }],
    })
    const serviceWorker = await import('./service-worker')

    await serviceWorker.processBreakReminder({
      id: 1,
      url: 'https://example.com',
    } as chrome.tabs.Tab)

    expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(0)
  })
})
