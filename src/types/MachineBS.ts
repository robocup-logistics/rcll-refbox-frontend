import Machine from '@/types/Machine'

export default interface MachineBS extends Machine {
  mtype: 'BS'

  // current state
  bs_color: string // e.g. 'BASE_RED'
  bs_side: string // ? e.g. 'INPUT'
}
