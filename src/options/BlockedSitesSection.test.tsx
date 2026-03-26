import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import type * as BlockSiteModule from '../domain/block-site'
import { BlockedSitesSection } from './BlockedSitesSection'

vi.mock('../domain/block-site', async () => {
  const actual = await vi.importActual<typeof BlockSiteModule>(
    '../domain/block-site'
  )

  return {
    ...actual,
    getBlockSiteStorage: vi.fn(() => ({
      toggleSitesBlock: vi.fn(),
    })),
  }
})

vi.mock('./AddOrSearchBlockedSite', () => ({
  __esModule: true,
  default: () => <div>Add site control</div>,
}))

vi.mock('./BlockedSitesList', () => ({
  __esModule: true,
  default: () => <div>Blocked sites list</div>,
}))

vi.mock('./take-a-break/TakeABreakAlert', () => ({
  __esModule: true,
  default: () => null,
}))

describe(BlockedSitesSection, () => {
  it('disables blocking toggle and shows pomodoro banner when active', () => {
    const toggleSitesBlocking = vi.fn()

    render(
      <BlockedSitesSection
        enableBlocking
        pomodoroActive
        toggleSitesBlocking={toggleSitesBlocking}
      />
    )

    expect(screen.getByText('Pomodoro is active')).not.toBeNull()
    expect(
      screen.getByText(
        'Pomodoro currently controls website blocking, so the toggle below is temporarily unavailable.'
      )
    ).not.toBeNull()

    const checkbox = screen.getByRole('checkbox', {
      name: 'Enable site blocking',
    })
    expect(checkbox).toBeDisabled()
  })
})
