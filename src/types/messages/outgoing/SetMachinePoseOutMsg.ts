import type MachinePose from '@/types/MachinePose'

// SETCONFIGVALUEOUTMSG  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to set a config value
type SetMachinePoseOutMsg = {
  command: 'set_machine_pose'
} & MachinePose

export default SetMachinePoseOutMsg
