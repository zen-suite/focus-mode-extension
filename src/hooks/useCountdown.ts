import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

export function useCountdown(targetDate?: string) {
  const [now, setNow] = useState(() => dayjs())

  useEffect(() => {
    if (!targetDate) {
      return
    }

    const intervalId = setInterval(() => {
      setNow(dayjs())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [targetDate])

  return useMemo(() => {
    if (!targetDate) {
      return 0
    }

    return Math.max(dayjs(targetDate).diff(now, 'second'), 0)
  }, [now, targetDate])
}
