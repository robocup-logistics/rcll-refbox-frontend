export default interface InfoMessage {
  component: string
  level: 'info' | 'warn'
  message: string
  time: string
}
