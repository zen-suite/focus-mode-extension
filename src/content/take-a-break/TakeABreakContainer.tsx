import { Fragment, useEffect, useState } from 'react'
import { createMessageHandler } from '../../util/messages'
import { type IBreakTimeMessage } from '../../domain/take-a-break'
import TakeABreakPopup from './TakeABreakPopup'

export default function TakeABreakReminder() {
  const [breakUntil, setBreakUntil] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const onMessageReceived = createMessageHandler(
      (message: IBreakTimeMessage) => {
        if (message.data.breakUntil) {
          setBreakUntil(new Date(message.data.breakUntil))
        }
      }
    )
    chrome.runtime.onMessage.addListener(onMessageReceived)
    return () => {
      chrome.runtime.onMessage.removeListener(onMessageReceived)
    }
  }, [])

  if (!breakUntil) {
    return <Fragment />
  }

  return (
    <div>
      <TakeABreakPopup breakUntil={breakUntil} />
    </div>
  )
}
