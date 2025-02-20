// MachineWorkStatus - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Indicator for work status of a machine
type MachineWorkStatus = {
  name: string // e.g. 'C-BS'
  busy: boolean
  ready: boolean // needs to be set to bring machine to READY-AT-OUTPUT state, unset to transition from READY-AT-OUTPUT to IDLE
}
export default MachineWorkStatus
