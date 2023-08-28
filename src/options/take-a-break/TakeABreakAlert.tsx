import { Alert } from '@mui/material'
import dayjs from 'dayjs'
import { Fragment } from 'react'

export default function TakeABreakAlert(props: {
  breakUntil: string | undefined
}) {
  const breakUntilDayJS = dayjs(props.breakUntil)
  if (!props.breakUntil || breakUntilDayJS.isBefore(dayjs())) {
    return <Fragment />
  }

  return (
    <Alert severity="info">
      Website blocking is temporarily disabled until{' '}
      {breakUntilDayJS.format('hh:mm a')}.
    </Alert>
  )
}
