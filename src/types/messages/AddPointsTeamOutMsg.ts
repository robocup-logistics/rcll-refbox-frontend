import Color from '@/types/Color'

export default interface AddPointsTeamOutMsg {
  command: 'add_points_team'
  points: number
  team_color: Color
  game_time: number
  phase: string // todo
  reason: string
}
