import type AwardedPoints from '@/types/AwardedPoints'
import type Order from '@/types/Order'
import type Phase from '@/types/Phase'
import type RingSpec from '@/types/RingSpec'
import type State from '@/types/State'
import AgentTask from '@/types/AgentTask'

export default interface GameReport {
  _id: string // MongoDB ObjectId
  report_version: number
  report_name: string

  // game
  config: Array<{
    path: string
    type: 'BOOL' | 'UINT' | 'STRING'
    value: any
    is_list: boolean
    list_value: any[]
  }>
  start_time: string // standard time string that can be used to create a Date
  end_time: string
  teams: [string, string]
  points: AwardedPoints[]
  gamestate_history: Array<{
    is_latest: boolean
    state: State
    phase: Phase
    game_time: number
    cont_time: number
    over_time: boolean
  }>

  // orders
  orders: Order[]

  // machines
  machine_history: any[] // TODO
  machine_meta: any[] // TODO
  machine_ss_shelf_slots: any[] // TODO
  machines: any[] // TODO has other properties than Machine
  ring_specs: RingSpec[]

  // robots
  robot_pose_history: any[] // TODO larger object
  agent_task_history: AgentTask[]

  // workpieces
  workpiece_history: any[] // TODO
}
