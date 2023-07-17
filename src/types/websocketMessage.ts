export default interface WebsocketMessage {
  level: 'clips' | 'info' | 'warn' | 'attention'
  type:
    | 'gamestate'
    | 'robot-info'
    | 'machine-info'
    | 'ring-spec'
    | 'order-info'
    | 'points'
    | 'order-count'
    | 'known-teams'
  message: string
  time: string
  component: string
  text: string
}
