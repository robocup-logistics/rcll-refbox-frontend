export default interface AttentionMessage {
  game_time: number
  level: 'attention'
  team: string
  text: string
  time_to_display: string
}
