import type ConfigPreset from '@/types/ConfigPreset'

// SETCONFIGPRESETOUTMSG  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to load a config preset
type SetConfigValueOutMsg = {
  command: 'set_preset'
} & ConfigPreset

export default SetConfigPresetOutMsg
