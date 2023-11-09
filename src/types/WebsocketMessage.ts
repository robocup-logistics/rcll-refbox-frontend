export default interface WebsocketMessage {
  // level and type only for incoming messages
  level?: 'clips' | 'info' | 'warn' | 'attention'
  type?:
    | 'gamestate'
    | 'robot-info'
    | 'machine-info'
    | 'ring-spec'
    | 'order-info'
    | 'points'
    | 'order-count'
    | 'known-teams'
  // level != clips
  message?: string
  time_to_display?: string
  game_time?: number
  component?: string
  text?: string
  // special info depending on type
  known_teams?: string[]
  // outgoing message
}
