import Color from '@/types/Color'
import type Phase from '@/types/Phase'
import AwardedPoints from '@/types/AwardedPoints'
import Robot from '@/types/Robot'
import Machine from '@/types/Machine'

type GameEvent = {
  phase: Phase
  cont_time: number
  category: 'game' | 'robot' | 'machine'
  icon: string // fontawesome icon string
  msg: string
  team?: Color | undefined
  linkedEl?: string
}

export default GameEvent
