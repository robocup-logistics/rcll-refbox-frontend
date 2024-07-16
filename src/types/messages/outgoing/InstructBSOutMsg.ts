import type InstructBS from '@/types/InstructBS'

type InstructBSOutMsg = {
  command: 'instruct_bs'
} & InstructBS

export default InstructBSOutMsg
