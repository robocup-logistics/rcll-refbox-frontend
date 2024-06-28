import type InstructCS from '@/types/InstructCS'

type InstructCSOutMsg = {
  command: 'instruct_cs'
} & InstructCS

export default InstructCSOutMsg
