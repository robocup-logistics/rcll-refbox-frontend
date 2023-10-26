import Color from '@/types/Color'

export default interface Robot {
  has_pose: boolean // e.g. true
  host: string // e.g. "127.0.0.1"
  last_seen: string[] // [unix time stamp, ms] e.g. [ "1694714658", "393161" ]
  level: 'clips'
  maintenance_cylces: number // e.g. 0
  'maintenance_start-time': number // e.g. 0
  maintenance_warning_sent: boolean // e.g. false
  name: string // e.g. "robot1"
  number: number // e.g. 1
  port: number // e.g. 4444
  pose: string[] // e.g. [ "6.500000", "3.620000", "0.000000" ]
  state: string // e.g. "ACTIVE"
  team: string // e.g. "CAROLOGISTICS"
  team_color: Color
  type: 'robot-info'
  warning_sent: boolean // true = away, false = there again
}
