import { render, screen } from '@testing-library/react'
import SettingsList from './SettingsList'

describe(SettingsList, () => {
  it('renders correctly', () => {
    render(<SettingsList />)
    expect(screen.getByText('Blocked sites')).not.toBeNull()
  })
})
