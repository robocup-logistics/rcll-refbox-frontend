import type MachineWorkStatus from '@/types/MachineWorkStatus'

// SETCONFIGVALUEOUTMSG  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to set a config value
type SetMachineWorkStatusOutMsg = {
  command: 'set_machine_work_status'
} & MachineWorkStatus

export default SetMachineWorkStatusOutMsg
