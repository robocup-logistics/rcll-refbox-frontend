import Color from '@/types/Color'

export default interface SetRobotMaintenanceOutMsg {
  command: 'set_robot_maintenance'
  robot_number: number
  team_color: Color
  maintenance: boolean
}
