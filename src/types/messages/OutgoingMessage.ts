import AddPointsTeamOutMsg from '@/types/messages/outgoing/AddRewardOutMsg'
import ConfirmDeliveryOutMsg from '@/types/messages/outgoing/ConfirmDeliveryOutMsg'
import InstructBSOutMsg from '@/types/messages/outgoing/InstructBSOutMsg'
import InstructCSOutMsg from '@/types/messages/outgoing/InstructCSOutMsg'
import InstructRSOutMsg from '@/types/messages/outgoing/InstructRSOutMsg'
import InstructDSOutMsg from '@/types/messages/outgoing/InstructDSOutMsg'
import InstructSSOutMsg from '@/types/messages/outgoing/InstructSSOutMsg'
import SetTeamNameOutMsg from '@/types/messages/outgoing/SetTeamNameOutMsg'
import SetGamephaseOutMsg from '@/types/messages/outgoing/SetGamephaseOutMsg'
import SetGamestateOutMsg from '@/types/messages/outgoing/SetGamestateOutMsg'
import RandomizeFieldOutMsg from '@/types/messages/outgoing/RandomizeFieldOutMsg'
import SetRobotMaintenanceOutMsg from '@/types/messages/outgoing/RobotMainenanceOutMsg'
import SetConfigValueOutMsg from '@/types/messages/outgoing/SetConfigValueOutMsg'
import SetConfigPresetOutMsg from '@/types/messages/outgoing/SetConfigPresetOutMsg'
import SetMachinePoseOutMsg from '@/types/messages/outgoing/SetMachinePoseOutMsg'
import ResetOutMsg from '@/types/messages/outgoing/ResetOutMsg'

// OUTGOINGMESSAGE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// there are several messages that can be sent to the refbox via the socket
// connection as described in the 'outgoing' subfolder
type OutgoingMessage =
  | AddPointsTeamOutMsg
  | InstructBSOutMsg
  | InstructCSOutMsg
  | InstructRSOutMsg
  | InstructDSOutMsg
  | InstructSSOutMsg
  | ConfirmDeliveryOutMsg
  | SetTeamNameOutMsg
  | SetGamephaseOutMsg
  | SetGamestateOutMsg
  | RandomizeFieldOutMsg
  | SetRobotMaintenanceOutMsg
  | SetConfigValueOutMsg
  | SetConfigPresetOutMsg
  | SetMachinePoseOutMsg
  | ResetOutMsg
export default OutgoingMessage
