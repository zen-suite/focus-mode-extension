import dayjs from 'dayjs'
import {
  getBlockSiteStorage,
  TAKE_A_BREAK_ALARM_NAME,
} from '../domain/block-site'
import { IBreakTimeMessage } from '../domain/take-a-break'
import { Message, MessageType } from '../util/messages'
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

chrome.runtime.onMessage.addListener((message: Message) => {
  switch (message.topic) {
    case MessageType.ADD_MORE_BREAK_TIME:
      return addMoreBreakTime(message.data)
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
    const tabs = await chrome.tabs.query({
      currentWindow: true,
    })

    await Promise.all(
      tabs.map(async (tab) => {
        if (!tab.id) {
          return
        }
        await chrome.tabs.sendMessage<IBreakTimeMessage>(tab.id, {
          data: {
            breakUntil: breakTimeDayJS.toISOString(),
          },
          topic: MessageType.TAKE_A_BREAK,
        })
      })
    )
  }
}

async function addMoreBreakTime({
  num,
  unit,
}: {
  num: number
  unit: dayjs.ManipulateType
}) {
  const storage = getBlockSiteStorage()
  const blockedSiteSchema = await storage.get()
  if (!blockedSiteSchema.breakUntil) {
    return
  }
  await storage.setBreakTime(
    dayjs(blockedSiteSchema.breakUntil).add(num, unit).toDate()
  )
  return { success: true }
}
