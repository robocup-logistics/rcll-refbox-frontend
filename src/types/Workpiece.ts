import type Color from '@/types/Color'
import type Machine from '@/types/Machine'

export default interface Workpiece {
  id: number
  name: string // usually "WP-genNUMBER"
  order: number
  latest_data: boolean // @TODO ?
  start_time: number
  end_time: number
  at_machine: string // e.g. 'C-CS1'
  at_side: string // e.g. 'RIGHT'
  holding: boolean
  robot_holding: number
  unknown_action: boolean
  state:
    | 'IDLE'
    | 'WAIT-IDLE'
    | 'PROCESSING'
    | 'PROCESSED'
    | 'READY-AT-OUTPUT'
    | 'BROKEN'
    | 'DOWN'

  base_color: string // e.g. 'BASE_RED'
  ring_colors: string[]
  cap_color: string
  team: Color
  visible: 0 // @TODO ?
}
