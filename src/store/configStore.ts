import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import type ConfigValue from '@/types/ConfigValue'
import SetConfigValueOutMsg from '@/types/messages/outgoing/SetConfigValueOutMsg'
import { useSocketStore } from '@/store/socketStore'

// CONFIG STORE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the config store contains the configuration of the game. While most of the
// configuration is regarded as irrelevant, the application heavily relies on
// some configuration options such as the
export const useConfigStore = defineStore('configStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const socketStore = useSocketStore()

  // CONSTS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const defaultGameConfig: Array<[string, any]> = [
    ['/llsfrb/globals/setup-time', 300],
    ['/llsfrb/globals/production-time', 1200],
    ['/llsfrb/game/exploration-time', 180],
    ['/llsfrb/globals/production-overtime', 300],
    [
      '/llsfrb/globals/phases',
      ['PRE_GAME', 'SETUP', 'PRODUCTION', 'POST_GAME'],
    ],
    ['/llsfrb/game/field/height', 8],
    ['/llsfrb/game/field/mirrored', true],
    ['/llsfrb/game/field/width', 7],
    ['/llsfrb/globals/number-of-orders', 11],
    ['/llsfrb/globals/max-robots-per-team', 3],
    ['/llsfrb/globals/maintenance-allowed-time', 120],
    ['/llsfrb/globals/maintenance-allowed-cycles', 2],
  ]

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> game config
  const gameConfig: Ref<Map<string, any>> = ref(new Map(defaultGameConfig))

  // FUNCTIONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> set config value
  function setConfigValue(configValueArg: ConfigValue) {
    gameConfig.value.set(configValueArg.path, configValueArg.value)
  }

  // -> send a message to the websocket to set a config value
  function sendSetConfigValue({ path, value }: ConfigValue) {
    const msg: SetConfigValueOutMsg = {
      command: 'set_confval',
      path,
      value,
    }
    socketStore.sendMessage(msg)
  }

  // -> reset
  function reset() {
    gameConfig.value = new Map(defaultGameConfig)
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    gameConfig,
    setConfigValue,
    sendSetConfigValue,
    reset,
  }
})
