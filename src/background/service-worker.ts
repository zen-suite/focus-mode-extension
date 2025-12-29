import dayjs from 'dayjs'
import {
  getBlockSiteStorage,
  TAKE_A_BREAK_ALARM,
  TAKE_A_BREAK_REMINDER_ALARM,
} from '../domain/block-site'
import { IBreakTimeMessage } from '../domain/take-a-break'
import { Message, MessageType } from '../util/messages'
import { TAKE_A_BREAK_CONFIG } from '../domain/config'
import { extractDomain } from '../util/host'
async function initializeExtension() {
  const storage = getBlockSiteStorage()
  const enableBlocking = await storage.getEnableBlocking()
  await storage.toggleSitesBlock(enableBlocking)
  await chrome.alarms.create(TAKE_A_BREAK_REMINDER_ALARM, {
    delayInMinutes: 0,
    periodInMinutes: 1,
  })
}

chrome.runtime.onInstalled.addListener(async () => {
  await initializeExtension()
})

chrome.runtime.onStartup.addListener(async () => {
  await initializeExtension()
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === TAKE_A_BREAK_ALARM) {
    await processBreakOver()
  }
  if (alarm.name === TAKE_A_BREAK_REMINDER_ALARM) {
    await processBreakReminderForAllTabs()
  }
})

chrome.runtime.onMessage.addListener((message: Message) => {
  switch (message.topic) {
    case MessageType.ADD_MORE_BREAK_TIME:
      return addMoreBreakTime(message.data)
    case MessageType.PROCESS_BREAK_TIME_REMINDER:
      return processBreakReminderForAllTabs()
  }
})

async function processBreakReminderForAllTabs() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
  })
  await Promise.all(
    tabs.map(async (tab) => {
      if (!tab.url || !tab.id) {
        return
      }
      await processBreakReminder(tab)
    })
  )
}

async function processBreakOver() {
  const storage = getBlockSiteStorage()
  const storedData = await storage.get()
  const breakTime = storedData.breakUntil
  if (!breakTime) {
    return
  }
  const breakTimeDayJS = dayjs(breakTime)
  if (breakTimeDayJS.isBefore(dayjs())) {
    await storage.toggleSitesBlock(true)
    await storage.update('breakUntil', undefined)
  }
}

async function processBreakReminder(tab: chrome.tabs.Tab) {
  const storage = getBlockSiteStorage()
  const storedData = await storage.get()
  const breakTime = storedData.breakUntil
  if (!breakTime) {
    return
  }
  const breakTimeDayJS = dayjs(breakTime)

  if (
    breakTimeDayJS.diff(dayjs(), TAKE_A_BREAK_CONFIG.remindTime.unit) <=
    TAKE_A_BREAK_CONFIG.remindTime.value
  ) {
    if (!tab.url || !tab.id) {
      return
    }

    const tabDomain = extractDomain(tab.url).replace('www.', '')
    const domainIsBlocked = storedData.blockedSites.some(
      (blockedSite) => blockedSite.domain === tabDomain
    )
    if (!domainIsBlocked) {
      return
    }
    await chrome.tabs.sendMessage<IBreakTimeMessage>(tab.id, {
      data: {
        breakUntil: breakTimeDayJS.toISOString(),
      },
      topic: MessageType.TAKE_A_BREAK,
    })
    console.log('message sent to tab', tab.url)
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
