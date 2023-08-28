import { render, screen } from '@testing-library/react'
import { vitest } from 'vitest'
import SettingsList from './SettingsList'
import { SettingTab } from './types'

describe(SettingsList, () => {
  it('renders correctly', () => {
    render(
      <SettingsList
        onTabSelected={vitest.fn}
        currentTab={SettingTab.BLOCKED_SITES}
      />
    )
    expect(screen.getByText('Blocked sites')).not.toBeNull()
  })
})
