import type dayjs from 'dayjs'

export function createMessageHandler<T = any>(cb: (message: T) => void) {
  return (message: T) => {
    if (!isValidMessage<T>(message)) {
      throw new Error('Message is not valid')
    }
    cb(message)
  }
}

export function isValidMessage<T>(message: any): message is IMessage<T> {
  return 'topic' in message && 'data' in message
}

export enum MessageType {
  TAKE_A_BREAK = 'TAKE_A_BREAK',
  ADD_MORE_BREAK_TIME = 'ADD_MORE_BREAK_TIME',
}

export interface IMessage<T = any> {
  data: T
  topic: MessageType
}

export type Message = IAddMoreBreakTime | { topic: MessageType.TAKE_A_BREAK }

export interface IAddMoreBreakTime extends IMessage {
  data: { num: number; unit: dayjs.ManipulateType }
  topic: MessageType.ADD_MORE_BREAK_TIME
}

export async function sendMessage<T extends IMessage>(message: T) {
  return await chrome.runtime.sendMessage(message)
}
