import type Reward from '@/types/Reward'
import type Order from '@/types/Order'
import type Phase from '@/types/Phase'
import type RingSpec from '@/types/RingSpec'
import type State from '@/types/State'
import type AgentTask from '@/types/AgentTask'
import type Robot from '@/types/Robot'
import { type MachineStatic, type MachineCurrent } from '@/types/Machine'
import type Workpiece from '@/types/Workpiece'
import type ShelfSlot from '@/types/ShelfSlot'

// GAMEREPORT  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the GameReport type represents the game report format as stored in the
// database
export default interface GameReport {
  _id: string // unique identifier (used for requests)
  report_version: 2
  report_name: string

  // game
  config: Array<{
    path: string
    type: 'BOOL' | 'UINT' | 'STRING'
    is_list: boolean
    value: any
  }>
  start_time: string // standard time string that can be used to create a Date
  end_time: string
  game_end_time: number
  teams: [string, string]
  points: Reward[]
  gamestate_history: Array<{
    state: State
    phase: Phase
    game_time: number
    cont_time: number
    over_time: boolean
  }>

  // orders & workpieces
  orders: Order[]
  workpiece_history: Array<Workpiece & { start_time: number; end_time: number }>

  // machines
  machines: MachineStatic[]
  machine_history: Array<MachineCurrent & { game_time: number }>
  ring_specs: RingSpec[]
  shelf_slot_history: Array<ShelfSlot & { game_time: number }>

  // robots
  robot_history: Array<Robot & { game_time: number }>
  agent_task_history: Array<
    AgentTask & { start_time: number; end_time: number }
  >
}
