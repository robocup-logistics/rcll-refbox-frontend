import Machine from '@/types/Machine'

export default interface MachineCS extends Machine {
  mtype: 'CS'
  // as of 2023, the color information is not available. This will change with
  // the new rules but for now, this has to be set manually
  cs_color: 'CAP_BLACK' | 'CAP_GREY'

  // current state
  cs_cap_color: string // e.g. 'CAP_BLACK'
  cs_operation: string // ? e.g. 'RETRIEVE_CAP'
  cs_retrieved: boolean // ? e.g. false
}
