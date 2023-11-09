import type Phase from '@/types/Phase'
import type State from '@/types/State'

export default interface Gamestate {
  cyan: string // name of the cyan team, e.g. 'Carologistics'
  field_height: number
  field_mirrored: boolean
  field_width: number
  game_time: number // game time in seconds (including miliseconds after the comma)
  magenta: string
  over_time: boolean
  phase: Phase
  points_cyan: string // e.g. '129'
  points_magenta: string
  state: State
}
