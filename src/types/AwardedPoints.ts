import Color from '@/types/Color'

export default interface AwardedPoints {
  game_time: number // e.g. 114.920059
  order: number // 0 when not associated to an order
  phase: string // e.g. 'PRODUCTION'
  points: number // e.g. 2
  reason: string // e.g. 'Retrieved cap at C-CS2'
  team: Color
}
