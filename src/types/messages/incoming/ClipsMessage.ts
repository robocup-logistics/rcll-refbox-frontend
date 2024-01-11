import AgentTask from '@/types/AgentTask'
import AwardedPoints from '@/types/AwardedPoints'
import Gamestate from '@/types/Gamestate'
import Machine from '@/types/Machine'
import Order from '@/types/Order'
import RingSpec from '@/types/RingSpec'
import Robot from '@/types/Robot'
import Workpiece from '@/types/Workpiece'

type ClipsMessage = {
  level: 'clips'
} & (
  | ({ type: 'gamestate' } & Gamestate)
  | ({ type: 'robot-info' } & Robot)
  | ({ type: 'machine-info' } & Machine)
  | ({ type: 'ring-spec' } & RingSpec)
  | ({ type: 'order-info' } & Order)
  | ({ type: 'points' } & AwardedPoints)
  | { type: 'order-count'; count: number }
  | { type: 'known-teams'; known_teams: string[] }
  | ({ type: 'workpiece-info' } & Workpiece)
  | ({ type: 'agent-task' } & AgentTask)
)

export default ClipsMessage
