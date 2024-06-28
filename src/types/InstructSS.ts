type InstructSS = {
  team_name: string // e.g. Carologistics,
  machine: string // e.g. 'C-BS'
  operation: 'STORE' | 'RETRIEVE'
  shelf: number
  slot: number
}
export default InstructSS
