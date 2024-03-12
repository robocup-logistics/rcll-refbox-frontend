import type AgentTask from '@/types/AgentTask'
import type Reward from '@/types/Reward'
import type Gamestate from '@/types/Gamestate'
import type Machine from '@/types/Machine'
import type Order from '@/types/Order'
import type RingSpec from '@/types/RingSpec'
import type Robot from '@/types/Robot'
import type Workpiece from '@/types/Workpiece'
import type TimeInfo from '@/types/TimeInfo'
import type KnownTeams from '@/types/KnownTeams'
import type ConfigValue from '@/types/ConfigValue'
import type ConfigPreset from '@/types/ConfigPreset'
import type ShelfSlot from '@/types/ShelfSlot'

// CLIPSMESSAGE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// while clips messages have the same base-level attributes the content of the
// 'content' attribute is completely different based on the type.
type ClipsMessage = {
  level: 'clips'
} & (
  | { type: 'time-info'; content: TimeInfo }
  | { type: 'gamestate'; content: Gamestate }
  | { type: 'known-teams'; content: KnownTeams }
  | { type: 'points'; content: Reward }
  | { type: 'order'; content: Order }
  | { type: 'workpiece'; content: Workpiece }
  | { type: 'robot'; content: Robot }
  | { type: 'agent-task'; content: AgentTask }
  | { type: 'machine'; content: Machine }
  | { type: 'ring-spec'; content: RingSpec }
  | { type: 'confval'; content: ConfigValue }
  | { type: 'cfg-preset'; content: ConfigPreset }
  | { type: 'shelf-slot'; content: ShelfSlot }
)

export default ClipsMessage
