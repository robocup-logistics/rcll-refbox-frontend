import Color from '@/types/Color'

// ROBOTMAINTENANCEOUTMSG  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to set a robot's maintenance status
export default interface SetRobotMaintenanceOutMsg {
  command: 'set_robot_maintenance'
  robot_number: number
  team_color: Color
  maintenance: boolean
}
