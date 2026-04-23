import { render, screen } from '@testing-library/react'
import dayjs from 'dayjs'
import { vitest } from 'vitest'
import { PomodoroPhase } from '../domain/block-site'
import { AppContent } from './AppContentContainer'

describe(AppContent, () => {
  it('does not render pomodoro status when inactive', () => {
    render(
      <AppContent
        blockedSites={[]}
        blockSite={vitest.fn()}
        currentDomain="example.com"
        goToOptionsPage={vitest.fn()}
        validDomain
        enabledBlocking
        enableFocusMode={vitest.fn()}
        pomodoro={{
          isActive: false,
          phase: PomodoroPhase.FOCUS,
          focusDurationMinutes: 25,
          breakDurationMinutes: 5,
        }}
      />
    )

    expect(screen.queryByText(/Pomodoro is off/i)).toBeNull()
  })

  it('renders pomodoro status when active', () => {
    render(
      <AppContent
        blockedSites={[]}
        blockSite={vitest.fn()}
        currentDomain="example.com"
        goToOptionsPage={vitest.fn()}
        validDomain
        enabledBlocking
        enableFocusMode={vitest.fn()}
        pomodoro={{
          isActive: true,
          phase: PomodoroPhase.FOCUS,
          focusDurationMinutes: 25,
          breakDurationMinutes: 5,
          phaseEndsAt: dayjs().add(5, 'minute').toISOString(),
        }}
      />
    )

    expect(screen.getByText('Focus session')).not.toBeNull()
    expect(screen.getByText(/remaining/i)).not.toBeNull()
  })

  it('shows enable focus mode when blocking is disabled', () => {
    render(
      <AppContent
        blockedSites={[]}
        blockSite={vitest.fn()}
        currentDomain="example.com"
        goToOptionsPage={vitest.fn()}
        validDomain
        enabledBlocking={false}
        enableFocusMode={vitest.fn()}
        pomodoro={{
          isActive: false,
          phase: PomodoroPhase.FOCUS,
          focusDurationMinutes: 25,
          breakDurationMinutes: 5,
        }}
      />
    )

    expect(screen.getByRole('button', { name: /enable focus mode/i })).not.toBeNull()
  })

  it('hides enable focus mode when blocking is enabled', () => {
    render(
      <AppContent
        blockedSites={[]}
        blockSite={vitest.fn()}
        currentDomain="example.com"
        goToOptionsPage={vitest.fn()}
        validDomain
        enabledBlocking
        enableFocusMode={vitest.fn()}
        pomodoro={{
          isActive: false,
          phase: PomodoroPhase.FOCUS,
          focusDurationMinutes: 25,
          breakDurationMinutes: 5,
        }}
      />
    )

    expect(screen.queryByRole('button', { name: /enable focus mode/i })).toBeNull()
  })
})
