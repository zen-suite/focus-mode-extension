import dayjs from 'dayjs'
import {
  getBlockSiteStorage,
  POMODORO_ALARM,
  TAKE_A_BREAK_ALARM,
  TAKE_A_BREAK_REMINDER_ALARM,
} from '../domain/block-site'
import { IBreakTimeMessage } from '../domain/take-a-break'
import { Message, MessageType } from '../util/messages'
import { TAKE_A_BREAK_CONFIG } from '../domain/config'
import { extractDomain } from '../util/host'

export async function initializeExtension() {
  const storage = getBlockSiteStorage()
  const schema = await storage.get()
  if (schema.pomodoro.isActive) {
    await storage.syncPomodoroWithNow()
  } else {
    await storage.toggleSitesBlock(schema.enableBlocking)
  }
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
  if (alarm.name === POMODORO_ALARM) {
    await processPomodoroAlarm()
  }
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

export async function processBreakOver() {
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

export async function processPomodoroAlarm() {
  const storage = getBlockSiteStorage()
  const pomodoro = await storage.getPomodoro()
  if (!pomodoro.isActive || !pomodoro.phaseEndsAt) {
    return
  }

  if (dayjs(pomodoro.phaseEndsAt).isAfter(dayjs())) {
    return
  }

  await storage.transitionPomodoroPhase()
}

export async function processBreakReminder(tab: chrome.tabs.Tab) {
  const storage = getBlockSiteStorage()
  const storedData = await storage.get()
  if (storedData.pomodoro.isActive) {
    return
  }
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
