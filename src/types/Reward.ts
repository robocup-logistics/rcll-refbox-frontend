import Color from '@/types/Color'
import Phase from '@/types/Phase'

// REWARD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the Reward type is used for rewards as received by the websocket or stored in
// game reports
export default interface Reward {
  game_time: number
  order: number // 0 when not associated to an order
  phase: Phase
  points: number // e.g. 2
  reason: string // e.g. 'Retrieved cap at C-CS2'
  team: Color
}
