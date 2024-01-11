import Color from '@/types/Color'

// THIS TYPE SHOULD NOT BE USED - websocket workpiece info messages currently
// come in this format but they should come in the other format (type
// workpiece). this type is to track the current differences, the code assumes
// the other type
export default interface WorkpieceInfo {
  id: number

  at_machine: string
  state: string
  order: number
  team: Color

  base_color: string
  ring_colors: string[]
  cap_color: string

  visible: number
}
