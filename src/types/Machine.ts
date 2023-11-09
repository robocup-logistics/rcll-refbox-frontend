import Color from '@/types/Color'

export default interface Machine {
  mtype: string // e.g. 'BS'
  name: string // e.g. 'C-BS'
  rotation: number // e.g. 90
  state:
    | 'IDLE'
    | 'WAIT-IDLE'
    | 'PROCESSING'
    | 'PROCESSED'
    | 'READY-AT-OUTPUT'
    | 'BROKEN'
    | 'DOWN'
  team: Color
  zone: string // e.g. 'C_Z12'
}
