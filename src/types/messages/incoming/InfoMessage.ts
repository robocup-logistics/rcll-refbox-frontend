// INFOMESSAGE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// an info message is a simple message to display in the log
export default interface InfoMessage {
  component: string
  level: 'info' | 'warn'
  message: string
  time: string
}
