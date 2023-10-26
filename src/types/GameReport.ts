import type Phase from '@/types/Phase'
import type State from '@/types/State'

export default interface Gamestate {
  _id: string // MongoDB ObjectId
  'agent-task-history': any[] // TODO
  config: any[] // TODO ?
  'gamestate/POST_GAME': any // TODO ?
  'gamestate/PRODUCTION': any // TODO ?
  'gamestate/SETUP': any // TODO ?
  'machine-history': any[] // TODO
  'machine-meta': any[] // TODO
  'machine-ss-shelf-slots': any[] // TODO
  machines: any[] // TODO has other properties than Machine, e.g. actual_lights is missing
  orders: any[] // TODO has other properties than Order ...
  'phase-points-cyan': {
    EXPLORATION: number
    PRODUCTION: number
  }
  'phase-points-magents': {
    EXPLORATION: number
    PRODUCTION: number
  }
  points: any[] // TODO has other properties than AwardedPoints
  'report-name': string
  'report-version': number
  'ring-specs': any[] // TODO differs from RingSpecs because it is req-bases and not req_bases
  'robot-pose-history': any[] // TODO larger object
  'start-time': string // standard time string that can be used to create a Date
  'start-timestamp': [number, number] // TODO ?
  teams: [string, string]
  'total-points': [number, number]
  'workpiece-history': any[] // TODO
}
