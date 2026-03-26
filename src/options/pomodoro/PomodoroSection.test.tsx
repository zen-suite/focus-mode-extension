import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SnackbarProvider } from 'notistack'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PomodoroPhase } from '../../domain/block-site'
import PomodoroSection from './PomodoroSection'

const { storage, useBlockedSites } = vi.hoisted(() => ({
  storage: {
    startPomodoro: vi.fn(async () => {}),
    stopPomodoro: vi.fn(async () => {}),
    updatePomodoroDurations: vi.fn(async () => {}),
  },
  useBlockedSites: vi.fn(),
}))

vi.mock('../../domain/block-site', async () => {
  const actual = await vi.importActual('../../domain/block-site')
  return Object.assign({}, actual, {
    getBlockSiteStorage: () => storage,
  })
})

vi.mock('../../providers/BlockedSitesProvider', () => ({
  useBlockedSites: () => useBlockedSites(),
}))

describe(PomodoroSection, () => {
  beforeEach(() => {
    storage.startPomodoro.mockClear()
    storage.stopPomodoro.mockClear()
    storage.updatePomodoroDurations.mockClear()
    useBlockedSites.mockReturnValue({
      pomodoro: {
        isActive: false,
        phase: PomodoroPhase.FOCUS,
        focusDurationMinutes: 25,
        breakDurationMinutes: 5,
      },
      refetchSchema: vi.fn(async () => {}),
    })
  })

  it('updates durations and starts pomodoro', async () => {
    render(
      <SnackbarProvider>
        <PomodoroSection />
      </SnackbarProvider>
    )

    fireEvent.change(screen.getByLabelText('Focus duration (minutes)'), {
      target: {
        value: '30',
      },
    })
    fireEvent.change(screen.getByLabelText('Break duration (minutes)'), {
      target: {
        value: '10',
      },
    })
    fireEvent.click(screen.getByText('Start pomodoro'))

    await waitFor(() => {
      expect(storage.updatePomodoroDurations).toHaveBeenCalledWith({
        focusDurationMinutes: 30,
        breakDurationMinutes: 10,
      })
      expect(storage.startPomodoro).toHaveBeenCalledTimes(1)
    })
  })
})
