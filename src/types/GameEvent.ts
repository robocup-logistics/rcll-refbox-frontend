import Color from '@/types/Color'
import type Phase from '@/types/Phase'

// GAMEEVENT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the GameEvent type represents a game event as displayed in the specatator
// application as an alternative for the much more detailed and verbal log
type GameEvent = {
  phase: Phase
  cont_time: number
  icon: string // fontawesome icon string
  msg: string
  team?: Color | undefined
}

export default GameEvent
