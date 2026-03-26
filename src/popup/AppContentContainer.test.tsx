import { render, screen } from '@testing-library/react'
import dayjs from 'dayjs'
import { vitest } from 'vitest'
import { PomodoroPhase } from '../domain/block-site'
import { AppContent } from './AppContentContainer'

describe(AppContent, () => {
  it('renders pomodoro start action when inactive', () => {
    render(
      <AppContent
        blockedSites={[]}
        blockSite={vitest.fn()}
        currentDomain="example.com"
        goToOptionsPage={vitest.fn()}
        validDomain
        pomodoro={{
          isActive: false,
          phase: PomodoroPhase.FOCUS,
          focusDurationMinutes: 25,
          breakDurationMinutes: 5,
        }}
        onStartPomodoro={vitest.fn()}
        onStopPomodoro={vitest.fn()}
      />
    )

    expect(screen.getByText('Start pomodoro')).not.toBeNull()
  })

  it('renders pomodoro status when active', () => {
    render(
      <AppContent
        blockedSites={[]}
        blockSite={vitest.fn()}
        currentDomain="example.com"
        goToOptionsPage={vitest.fn()}
        validDomain
        pomodoro={{
          isActive: true,
          phase: PomodoroPhase.FOCUS,
          focusDurationMinutes: 25,
          breakDurationMinutes: 5,
          phaseEndsAt: dayjs().add(5, 'minute').toISOString(),
        }}
        onStartPomodoro={vitest.fn()}
        onStopPomodoro={vitest.fn()}
      />
    )

    expect(screen.getByText('Focus session')).not.toBeNull()
    expect(screen.getByText(/remaining/i)).not.toBeNull()
  })
})
