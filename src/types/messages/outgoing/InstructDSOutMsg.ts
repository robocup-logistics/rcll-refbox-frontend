import type InstructDS from '@/types/InstructDS'

type InstructDSOutMsg = {
  command: 'instruct_ds'
} & InstructDS

export default InstructDSOutMsg
