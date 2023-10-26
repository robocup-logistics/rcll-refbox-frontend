import Color from '@/types/Color'

export default interface SetTeamNameOutMsg {
  command: 'set_teamname'
  color: Color
  name: string
}
