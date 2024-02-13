import type Phase from '@/types/Phase'
import type State from '@/types/State'

// GAMESTATE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the Gamestate type, not to be confused with the state type, contains some
// current information about the game state
export default interface Gamestate {
  cyan: string // name of the cyan team, e.g. 'Carologistics'
  magenta: string
  over_time: boolean
  phase: Phase
  state: State
}
