import Color from '@/types/Color'

// ROBOT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the Robot type is used to represent robot information as sent by the
// websocket and stored in game reports
export default interface Robot {
  host?: string // e.g. "127.0.0.1"
  maintenance_cycles: number // e.g. 0
  maintenance_start_time: number // e.g. 0
  maintenance_warning_sent: boolean // e.g. false
  number: number // e.g. 1
  name?: string
  port?: number // e.g. 4444
  pose: [number, number, number] // e.g. [ 6.500000, 3.620000, 0.000000 ]
  state: 'ACTIVE' | 'MAINTENANCE' | 'DISQUALIFIED'
  team: string // e.g. "CAROLOGISTICS"
  team_color: Color
  warning_sent: boolean // true = away, false = there again
}
