import Color from '@/types/Color'

export default interface AgentTask {
  task_type: 'MOVE' | 'RETRIEVE' | 'DELIVER' | 'BUFFER' | 'EXPLORE_ZONE'
  task_parameters: ({ machine_id: string } | { waypoint: string }) & {
    machine_point?: string
  }
  task_id: number // unique per robot
  robot_id: number
  team_color: Color
  start_time: number
  end_time: number
  order_id: number
  processed: boolean
  workpiece_name: string
  unknown_action: boolean
  successful: boolean
  base_color: string
  ring_colors: string[]
  cap_color: string
}
