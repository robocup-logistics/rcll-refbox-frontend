import type InstructRS from '@/types/InstructRS'

type InstructRSOutMsg = {
  command: 'instruct_rs'
} & InstructRS

export default InstructRSOutMsg
