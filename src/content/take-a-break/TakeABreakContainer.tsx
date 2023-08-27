import { Fragment, useEffect, useState } from 'react'
import { type IBreakTimeMessage } from '../../domain/take-a-break'
import {
  MessageType,
  createMessageHandler,
  sendMessageToServiceWorker,
  type IAddMoreBreakTime,
} from '../../util/messages'
import TakeABreakPopup from './TakeABreakPopup'

export default function TakeABreakReminder() {
  const [breakUntil, setBreakUntil] = useState<string | undefined>(undefined)

  useEffect(() => {
    const onMessageReceived = createMessageHandler(
      (message: IBreakTimeMessage) => {
        if (message.data.breakUntil) {
          setBreakUntil(message.data.breakUntil)
        }
      }
    )
    chrome.runtime.onMessage.addListener(onMessageReceived)
    return () => {
      chrome.runtime.onMessage.removeListener(onMessageReceived)
    }
  }, [])

  const onAddMoreTime: React.ComponentProps<
    typeof TakeABreakPopup
  >['onAddMoreTime'] = async ({ num, unit }) => {
    await sendMessageToServiceWorker<IAddMoreBreakTime>({
      data: { num, unit },
      topic: MessageType.ADD_MORE_BREAK_TIME,
    })
  }

  if (!breakUntil) {
    return <Fragment />
  }

  return (
    <div>
      <TakeABreakPopup breakUntil={breakUntil} onAddMoreTime={onAddMoreTime} />
    </div>
  )
}
