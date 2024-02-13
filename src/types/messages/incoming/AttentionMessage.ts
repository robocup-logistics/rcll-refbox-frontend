// ATTENTIONMESSAGE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// attention messages play, in contrast to the plain info messages, a special
// role in the log messages because they are additionally shown huge and
// highlighted for a specified amount of time
export default interface AttentionMessage {
  game_time: number
  level: 'attention'
  team: string
  text: string
  time_to_display: string
}
