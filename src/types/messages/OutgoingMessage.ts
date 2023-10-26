import AddPointsTeamOutMsg from '@/types/messages/AddPointsTeamOutMsg'
import ConfirmDeliveryOutMsg from '@/types/messages/ConfirmDeliveryOutMsg'
import SetTeamNameOutMsg from '@/types/messages/SetTeamNameOutMsg'
import SetGamephaseOutMsg from '@/types/messages/SetGamephaseOutMsg'
import SetGamestateOutMsg from '@/types/messages/SetGamestateOutMsg'
import RandomizeFieldOutMsg from '@/types/messages/RandomizeFieldOutMsg'
import SetRobotMaintenanceOutMsg from '@/types/messages/RobotMainenanceOutMsg'

type OutgoingMessage =
  | AddPointsTeamOutMsg
  | ConfirmDeliveryOutMsg
  | SetTeamNameOutMsg
  | SetGamephaseOutMsg
  | SetGamestateOutMsg
  | RandomizeFieldOutMsg
  | SetRobotMaintenanceOutMsg
export default OutgoingMessage
