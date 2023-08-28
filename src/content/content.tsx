import { useEffect } from 'react'
import { MessageType, sendMessageToServiceWorker } from '../util/messages'
import TakeABreakReminder from './take-a-break/TakeABreakContainer'

export function Content() {
  useEffect(() => {
    sendMessageToServiceWorker({
      topic: MessageType.PROCESS_BREAK_TIME_REMINDER,
      data: undefined,
    })
  }, [])
  return (
    <div id="zen-mode-content">
      <TakeABreakReminder />
    </div>
  )
}
