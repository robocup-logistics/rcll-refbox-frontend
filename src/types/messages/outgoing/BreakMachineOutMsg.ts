import type BreakMachine from '@/types/BreakMachine'

type BreakMachineOutMsg = {
  command: 'break_machine'
} & BreakMachine

export default BreakMachineOutMsg
