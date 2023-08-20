import { type IMessage } from '../../util/messages'

export interface IBreakTimeMessage extends IMessage<{ breakUntil: string }> {}
