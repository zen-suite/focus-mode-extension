export function createMessageHandler(cb: (message: any) => void) {
  return (message: any) => {
    if (!isValidMessage(message)) {
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
}

export interface IMessage<T = any> {
  data: T
  topic: MessageType
}
