import Machine from '@/types/Machine'

export default interface MachineRS extends Machine {
  mtype: 'RS'
  rs_ring_colors: string[] // e.g. ['RING_ORANGE', 'RING_GREEN'] - what ring colors are available

  // current state
  rs_ring_color: string // e.g. 'RING_BLUE' - what ring is currently mounted
  bases_added: number
  bases_used: number
}
