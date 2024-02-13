import type Color from '@/types/Color'

// SETTEAMNAMEOUTMSG - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to set a team's name
export default interface SetTeamNameOutMsg {
  command: 'set_teamname'
  color: Color
  name: string
}
