import type Color from '@/types/Color'

// ADDREWARDOUTMSG - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to manually give a team points
export default interface AddRewardOutMsg {
  command: 'add_points_team'
  points: number
  team_color: Color
  game_time: number
  phase: string // todo
  reason: string
}
