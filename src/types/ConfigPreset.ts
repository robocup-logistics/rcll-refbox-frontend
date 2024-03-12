// CONFIGPRESET - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// the ConfigPreset type represents a pre-stored yaml file to be loaded
// received by the websocket and stored in game reports
type ConfigPreset = {
  category: string
  preset: string
}

export default ConfigPreset
