import WebsocketMessage from '@/types/WebsocketMessage'

export default interface InfoMessage extends WebsocketMessage {
  // level and type only for incoming messages
  level: 'info' | 'warn' | 'attention'
  // either these three for info and warn messages
  message?: string
  time?: string
  component?: string
  // or only text for attention messages
  text?: string
}
