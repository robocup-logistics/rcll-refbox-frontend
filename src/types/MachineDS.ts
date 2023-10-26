import Machine from '@/types/Machine'

export default interface MachineDS extends Machine {
  ds_order: number // ? e.g. 0
  mtype: 'DS'
}
