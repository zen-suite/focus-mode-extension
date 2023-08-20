import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export default function TakeABreakPopup(props: { breakUntil: Date }) {
  const [countdown, setCountdown] = useState<number>(() =>
    dayjs(props.breakUntil).diff(dayjs(), 'second')
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCountdown(dayjs(props.breakUntil).diff(dayjs(), 'second'))
    }, 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [props.breakUntil])

  return <div>Break is almost up: ${countdown} seconds</div>
}
