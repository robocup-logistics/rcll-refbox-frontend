// CONFIGVALUE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the ConfigValue type represents a configuration item in the game config as
// received by the websocket and stored in game reports
type ConfigValue = {
  path: string
  value: any
}

export default ConfigValue
