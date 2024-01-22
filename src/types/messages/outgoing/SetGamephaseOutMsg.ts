// SETGAMEPHASEOUTMSG  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to set the phase
export default interface SetGamephaseOutMsg {
  command: 'set_gamephase'
  phase: string
}
