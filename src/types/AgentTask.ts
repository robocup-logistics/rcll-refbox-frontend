import Color from '@/types/Color'

// AGENTTASK - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the AgentTask type represents an agent task. While, by concept, each robot
// can have only one agent task at a time, we store it seperately because it can
// come to overlaps and the information is also processed seperately in the
// refbox
type AgentTask = {
  task_id: number // unique per robot
  robot_id: number
  team_color: Color
  order_id: number
  processed: boolean
  workpiece_name: string
  unknown_action: boolean
  successful: boolean
  base_color: string
  ring_colors: string[]
  cap_color: string
} & (
  | {
      task_type: 'MOVE'
      task_parameters: {
        waypoint: string
        machine_point: string | null
      }
    }
  | {
      task_type: 'DELIVER' | 'RETRIEVE'
      task_parameters: {
        machine_id: string
        machine_point: string
      }
    }
)
// task types BUGGER and EXPLORE_ZONE might also be possible but got no details

export default AgentTask
