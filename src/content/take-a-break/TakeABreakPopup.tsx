import { Card, CardActions, CardContent, Button } from '@mui/material'
import dayjs from 'dayjs'
import { Fragment, useEffect, useState } from 'react'
import TakeABreakCountdown from './TakeABreakCountdown'

export default function TakeABreakPopup(props: { breakUntil: string }) {
  const [countdown, setCountdown] = useState<number>(0)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextCountdown = dayjs(props.breakUntil).diff(dayjs(), 'second')
      setCountdown(nextCountdown)
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [props.breakUntil])

  useEffect(() => {
    setIsDismissed(false)
  }, [props.breakUntil])

  if (isDismissed) {
    return <Fragment />
  }

  return (
    <Card
      sx={{
        top: 0,
        right: 0,
        mt: 1,
        mr: 1,
        position: 'absolute',
      }}
    >
      <CardContent>
        <TakeABreakCountdown countdown={countdown} />
        <CardActions>
          <Button>+5 more min</Button>
          <Button
            variant="contained"
            onClick={() => {
              setIsDismissed(true)
            }}
          >
            Dismiss
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  )
}
