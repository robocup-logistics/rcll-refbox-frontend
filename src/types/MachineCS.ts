import Machine from '@/types/Machine'

export default interface MachineCS extends Machine {
  cs_cap_color: string // e.g. 'CAP_BLACK'
  cs_operation: string // ? e.g. 'RETRIEVE_CAP'
  cs_retrieved: boolean // ? e.g. false
  mtype: 'CS'
}
