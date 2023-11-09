import AddPointsTeamOutMsg from '@/types/messages/outgoing/AddPointsTeamOutMsg'
import ConfirmDeliveryOutMsg from '@/types/messages/outgoing/ConfirmDeliveryOutMsg'
import SetTeamNameOutMsg from '@/types/messages/outgoing/SetTeamNameOutMsg'
import SetGamephaseOutMsg from '@/types/messages/outgoing/SetGamephaseOutMsg'
import SetGamestateOutMsg from '@/types/messages/outgoing/SetGamestateOutMsg'
import RandomizeFieldOutMsg from '@/types/messages/outgoing/RandomizeFieldOutMsg'
import SetRobotMaintenanceOutMsg from '@/types/messages/outgoing/RobotMainenanceOutMsg'

type OutgoingMessage =
  | AddPointsTeamOutMsg
  | ConfirmDeliveryOutMsg
  | SetTeamNameOutMsg
  | SetGamephaseOutMsg
  | SetGamestateOutMsg
  | RandomizeFieldOutMsg
  | SetRobotMaintenanceOutMsg
export default OutgoingMessage
