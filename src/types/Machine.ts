import Color from '@/types/Color'

// MACHINE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the Machine type is composed of two parts, static (set once) and current
// (regularly updated) information, see below. While the websocket currently
// sends both information together, the game reports make a distinction between
// them
export type Machine = MachineStatic & MachineCurrent
export default Machine

// -> MACHINE STATIC - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the machine static type contains static information about a machine that does
// not change
export type MachineStatic = {
  name: string // e.g. 'C-BS'
  rotation: number // in 45 steps
  team: Color
  zone: string // e.g. 'C_Z12'
} & (
  | {
      mtype: 'BS'
    }
  | {
      mtype: 'CS'
      available_color: 'CAP_BLACK' | 'CAP_GREY'
    }
  | {
      mtype: 'DS'
    }
  | {
      mtype: 'RS'
      available_colors: string[] // e.g. ['RING_ORANGE', 'RING_GREEN'] - what ring colors are available
    }
  | {
      mtype: 'SS'
    }
) &
  MachineCurrent

// -> MACHINE CURRENT  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - the machine current type contains current information about a machine that
// changes regularly
export type MachineCurrent = {
  name: string
  busy: 'WAIT' | 'FALSE' | 'TRUE'
  ready: boolean
  referee_required: boolean
  state:
    | 'IDLE'
    | 'WAIT-IDLE'
    | 'PROCESSING'
    | 'PROCESSED'
    | 'READY-AT-OUTPUT'
    | 'BROKEN'
    | 'DOWN'
} & (
  | {
      mtype: 'BS'
      current_base_color?: string // e.g. 'BASE_RED'
      current_side?: string // e.g. 'INPUT'
    }
  | {
      mtype: 'CS'
      operation_mode?: string // ? e.g. 'RETRIEVE_CAP'
      has_retrieved?: boolean // ? e.g. false
    }
  | {
      mtype: 'DS'
      order_id?: number // e.g. 0
    }
  | {
      mtype: 'RS'
      current_ring_color?: string // e.g. 'RING_BLUE' - what ring is currently mounted
      bases_added?: number
      bases_used?: number
    }
  | {
      mtype: 'SS'
      ss_operation?: 'STORE' | 'RETRIEVE' // does not exist yet
      // @TODO additional properties for what and where is stored
    }
)
