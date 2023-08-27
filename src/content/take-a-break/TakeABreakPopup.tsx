import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  CardHeader,
} from '@mui/material'
import dayjs from 'dayjs'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import TakeABreakCountdown from './TakeABreakCountdown'

export default function TakeABreakPopup(props: {
  breakUntil: string
  onAddMoreTime: (payload: {
    num: number
    unit: 'minute' | 'second'
  }) => void | Promise<void>
}) {
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

  const onAddMoreTime = useCallback(async () => {
    await props.onAddMoreTime({ num: 5, unit: 'minute' })
    setIsDismissed(true)
  }, [props])

  const cardContent = useMemo(() => {
    if (countdown <= 0) {
      return (
        <Fragment>
          <Typography mb={2}>
            Break time is up. Click reload to block the website.
          </Typography>
          <CardActions sx={{ px: 0 }}>
            <Button
              onClick={() => {
                setIsDismissed(true)
              }}
            >
              Dismiss
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                location.reload()
              }}
            >
              Reload webpage
            </Button>
          </CardActions>
        </Fragment>
      )
    }
    return (
      <Fragment>
        <TakeABreakCountdown countdown={countdown} />
        <CardActions>
          <Button onClick={onAddMoreTime}>+5 more min</Button>
          <Button
            variant="contained"
            onClick={() => {
              setIsDismissed(true)
            }}
          >
            Dismiss
          </Button>
        </CardActions>
      </Fragment>
    )
  }, [countdown, onAddMoreTime])

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
        position: 'fixed',
      }}
    >
      <CardHeader title="Focus mode extension" />
      <CardContent>{cardContent}</CardContent>
    </Card>
  )
}
