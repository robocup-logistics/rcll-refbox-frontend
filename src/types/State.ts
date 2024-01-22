// STATE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the State type, not to be confused with the gamestate type is used to
// represent the current state (gameStore)
type State = 'INIT' | 'WAIT_START' | 'RUNNING' | 'PAUSED'
export default State
