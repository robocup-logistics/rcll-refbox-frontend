import type ConfigValue from '@/types/ConfigValue'

// SETCONFIGVALUEOUTMSG  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to set a config value
type SetConfigValueOutMsg = {
  command: 'set_confval'
} & ConfigValue

export default SetConfigValueOutMsg
