export default interface ClipsMessage {
  level: 'clips'
  type:
    | 'gamestate'
    | 'robot-info'
    | 'machine-info'
    | 'ring-spec'
    | 'order-info'
    | 'points'
    | 'order-count'
    | 'known-teams'
  // special info depending on type
  known_teams?: string[]
}
