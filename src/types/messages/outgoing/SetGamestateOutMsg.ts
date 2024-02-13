import type State from '@/types/State'

// SETGAMESTATEOUTMSG  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to set the state
export default interface SetGamestateOutMsg {
  command: 'set_gamestate'
  state: State
}
