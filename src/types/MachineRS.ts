import Machine from '@/types/Machine'

export default interface MachineRS extends Machine {
  bases_added: number
  bases_used: number
  mtype: 'RS'
  rs_ring_color: string // e.g. 'RING_BLUE' - what ring is currently mounted
  rs_ring_colors: string[] // e.g. ['RING_ORANGE', 'RING_GREEN'] - what ring colors are available
}
