import AddPointsTeamOutMsg from '@/types/messages/outgoing/AddRewardOutMsg'
import ConfirmDeliveryOutMsg from '@/types/messages/outgoing/ConfirmDeliveryOutMsg'
import SetTeamNameOutMsg from '@/types/messages/outgoing/SetTeamNameOutMsg'
import SetGamephaseOutMsg from '@/types/messages/outgoing/SetGamephaseOutMsg'
import SetGamestateOutMsg from '@/types/messages/outgoing/SetGamestateOutMsg'
import RandomizeFieldOutMsg from '@/types/messages/outgoing/RandomizeFieldOutMsg'
import SetRobotMaintenanceOutMsg from '@/types/messages/outgoing/RobotMainenanceOutMsg'
import SetConfigValueOutMsg from '@/types/messages/outgoing/SetConfigValueOutMsg'

// OUTGOINGMESSAGE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// there are several messages that can be sent to the refbox via the socket
// connection as described in the 'outgoing' subfolder
type OutgoingMessage =
  | AddPointsTeamOutMsg
  | ConfirmDeliveryOutMsg
  | SetTeamNameOutMsg
  | SetGamephaseOutMsg
  | SetGamestateOutMsg
  | RandomizeFieldOutMsg
  | SetRobotMaintenanceOutMsg
  | SetConfigValueOutMsg
export default OutgoingMessage