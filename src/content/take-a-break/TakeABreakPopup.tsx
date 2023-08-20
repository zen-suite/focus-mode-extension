import dayjs from 'dayjs'
import { Fragment, useEffect, useState } from 'react'

export default function TakeABreakPopup(props: { breakUntil: string }) {
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(dayjs(props.breakUntil).diff(dayjs(), 'second'))
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [props.breakUntil])

  if (countdown < 0) {
    return <Fragment />
  }

  return <div>Break is almost up: {countdown} seconds</div>
}
