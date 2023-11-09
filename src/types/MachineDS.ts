import Machine from '@/types/Machine'

export default interface MachineDS extends Machine {
  ds_gate?: number // e.g. 0
  ds_order: number // e.g. 0
  mtype: 'DS'
}
