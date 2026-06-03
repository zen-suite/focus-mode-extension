import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PomodoroPhase } from '../domain/block-site'
import type * as BlockSiteModule from '../domain/block-site'
import BlockedSitesSectionContainer, {
  BlockedSitesSection,
} from './BlockedSitesSection'

const mockUseBlockedSites = vi.hoisted(() => vi.fn())
const mockToggleSitesBlock = vi.hoisted(() => vi.fn())
const mockRecordFrictionDisableSuccess = vi.hoisted(() => vi.fn())
const mockRefetchSchema = vi.hoisted(() => vi.fn())

vi.mock('../domain/block-site', async () => {
  const actual = await vi.importActual<typeof BlockSiteModule>(
    '../domain/block-site'
  )

  return {
    ...actual,
    getBlockSiteStorage: vi.fn(() => ({
      toggleSitesBlock: mockToggleSitesBlock,
      recordFrictionDisableSuccess: mockRecordFrictionDisableSuccess,
    })),
  }
})

vi.mock('../components/StrongFrictionDialog', () => ({
  StrongFrictionDialog: ({
    open,
    onConfirm,
  }: {
    open: boolean
    onConfirm: () => void
  }) =>
    open ? (
      <button type="button" onClick={onConfirm}>
        Mock confirm disable
      </button>
    ) : null,
}))

vi.mock('../providers/BlockedSitesProvider', () => ({
  useBlockedSites: mockUseBlockedSites,
}))

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

const defaultBlockedSitesContext = {
  refetchSchema: mockRefetchSchema,
  enabledBlocking: true,
  enforceStrongFriction: false,
  frictionLevel: 1,
  frictionDisableCount: 0,
  frictionDisablesPerLevel: 5,
  breakUntil: undefined,
  pomodoro: {
    isActive: false,
    phase: PomodoroPhase.FOCUS,
    focusDurationMinutes: 25,
    breakDurationMinutes: 5,
  },
  blockedSites: [],
  loading: false,
  error: undefined,
}

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

  it('calls toggle handler immediately when friction is off', async () => {
    const user = userEvent.setup()
    const toggleSitesBlocking = vi.fn().mockResolvedValue(undefined)

    render(
      <BlockedSitesSection
        enableBlocking
        pomodoroActive={false}
        toggleSitesBlocking={toggleSitesBlocking}
      />
    )

    await user.click(
      screen.getByRole('checkbox', { name: 'Enable site blocking' })
    )

    expect(toggleSitesBlocking).toHaveBeenCalledWith(false)
  })
})

describe(BlockedSitesSectionContainer, () => {
  beforeEach(() => {
    mockToggleSitesBlock.mockReset()
    mockToggleSitesBlock.mockResolvedValue(undefined)
    mockRecordFrictionDisableSuccess.mockReset()
    mockRecordFrictionDisableSuccess.mockResolvedValue(undefined)
    mockRefetchSchema.mockReset()
    mockRefetchSchema.mockResolvedValue(undefined)
    mockUseBlockedSites.mockReturnValue(defaultBlockedSitesContext)
  })

  it('disables blocking immediately when strong friction is off', async () => {
    const user = userEvent.setup()

    render(<BlockedSitesSectionContainer />)

    await user.click(
      screen.getByRole('checkbox', { name: 'Enable site blocking' })
    )

    expect(mockToggleSitesBlock).toHaveBeenCalledWith(false)
    expect(
      screen.queryByRole('button', { name: /mock confirm disable/i })
    ).toBeNull()
  })

  it('opens friction dialog when strong friction is enabled', async () => {
    const user = userEvent.setup()
    mockUseBlockedSites.mockReturnValue({
      ...defaultBlockedSitesContext,
      enforceStrongFriction: true,
    })

    render(<BlockedSitesSectionContainer />)

    await user.click(
      screen.getByRole('checkbox', { name: 'Enable site blocking' })
    )

    expect(mockToggleSitesBlock).not.toHaveBeenCalled()
    expect(
      screen.getByRole('button', { name: /mock confirm disable/i })
    ).not.toBeNull()
  })
})
