import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PomodoroPhase } from '../domain/block-site'
import BlockedSite from './BlockedSite'

const { useBlockedSites, useCountdown } = vi.hoisted(() => ({
  useBlockedSites: vi.fn(),
  useCountdown: vi.fn(),
}))

vi.mock('../providers/BlockedSitesProvider', () => ({
  useBlockedSites: () => useBlockedSites(),
}))

vi.mock('../hooks/useCountdown', () => ({
  useCountdown: (value?: string) => useCountdown(value),
}))

describe(BlockedSite, () => {
  it('shows pomodoro status and countdown when pomodoro is active', () => {
    useBlockedSites.mockReturnValue({
      pomodoro: {
        isActive: true,
        phase: PomodoroPhase.FOCUS,
        focusDurationMinutes: 25,
        breakDurationMinutes: 5,
        phaseEndsAt: '2026-03-26T10:00:00.000Z',
      },
    })
    useCountdown.mockReturnValue(305)

    render(<BlockedSite />)

    expect(screen.getByText('This website is blocked')).toBeInTheDocument()
    expect(screen.getByText('Focus session in progress')).toBeInTheDocument()
    expect(screen.getByText('5:05')).toBeInTheDocument()
    expect(
      screen.getByText('Pomodoro controls stay in the extension settings.')
    ).toBeInTheDocument()
    expect(screen.queryByText('Stop pomodoro')).toBeNull()
  })

  it('does not show pomodoro timer when pomodoro is inactive', () => {
    useBlockedSites.mockReturnValue({
      pomodoro: {
        isActive: false,
        phase: PomodoroPhase.FOCUS,
        focusDurationMinutes: 25,
        breakDurationMinutes: 5,
      },
    })
    useCountdown.mockReturnValue(0)

    render(<BlockedSite />)

    expect(screen.getByText('This website is blocked')).toBeInTheDocument()
    expect(screen.queryByText(/session in progress/i)).toBeNull()
    expect(
      screen.queryByText('Pomodoro controls stay in the extension settings.')
    ).toBeNull()
  })
})
