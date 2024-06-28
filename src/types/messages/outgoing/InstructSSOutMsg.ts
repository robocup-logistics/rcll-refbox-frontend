import type InstructSS from '@/types/InstructSS'

type InstructSSOutMsg = {
  command: 'instruct_ss'
} & InstructSS

export default InstructSSOutMsg
