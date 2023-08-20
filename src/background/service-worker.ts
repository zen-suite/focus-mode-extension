import dayjs from 'dayjs'
import {
  getBlockSiteStorage,
  TAKE_A_BREAK_ALARM_NAME,
} from '../domain/block-site'
import { IBreakTimeMessage } from '../domain/take-a-break'
import { MessageType } from '../util/messages'
chrome.runtime.onInstalled.addListener(async () => {
  await getBlockSiteStorage().syncBlockedSites()

  const takeABreakAlarm = await chrome.alarms.get(TAKE_A_BREAK_ALARM_NAME)
  if (!takeABreakAlarm) {
    await chrome.alarms.create(TAKE_A_BREAK_ALARM_NAME, {
      periodInMinutes: 1,
    })
  }
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === TAKE_A_BREAK_ALARM_NAME) {
    await breakOver()
  }
})

async function breakOver() {
  const storage = getBlockSiteStorage()
  const breakTime = (await storage.get()).breakUntil
  if (!breakTime) {
    return
  }
  const breakTimeDayJS = dayjs(breakTime)
  if (breakTimeDayJS.isBefore(dayjs())) {
    await storage.toggleSitesBlock(true)
    await storage.update('breakUntil', undefined)
  }
  if (breakTimeDayJS.diff(dayjs(), 'minute') <= 1) {
    chrome.runtime.sendMessage<IBreakTimeMessage>({
      data: {
        breakUntil: breakTimeDayJS.toISOString(),
      },
      topic: MessageType.TAKE_A_BREAK,
    })
  }
}
