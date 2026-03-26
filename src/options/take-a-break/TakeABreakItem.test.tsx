import { render, screen } from '@testing-library/react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { vitest } from 'vitest'
import { TakeABreakItem } from './TakeABreakItem'

describe(TakeABreakItem, () => {
  it('disables break controls when pomodoro is active', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TakeABreakItem disabled onSetBreakTime={vitest.fn()} />
      </LocalizationProvider>
    )

    expect(
      screen.getByText(
        'Pomodoro is active and currently controls website blocking.'
      )
    ).not.toBeNull()
    expect(screen.getByText('Set break time')).toBeDisabled()
  })
})
