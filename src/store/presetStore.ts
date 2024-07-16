import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import type ConfigPreset from '@/types/ConfigPreset'
import SetConfigPresetOutMsg from '@/types/messages/outgoing/SetConfigPresetOutMsg'
import { useSocketStore } from '@/store/socketStore'

// PRESET STORE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the preset store contains the configuration of the game.
export const usePresetStore = defineStore('presetStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const socketStore = useSocketStore()

  // CONSTS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const defaultConfigPresets: Set<ConfigPreset> = new Set([
    { category: 'challenges', preset: 'production' },
  ])
  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> game config
  const configPresets: Ref<Set<ConfigPreset>> = ref(
    new Set(defaultConfigPresets),
  )

  // FUNCTIONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> set config value
  function setConfigPreset(configPresetArg: ConfigPreset) {
    configPresets.value.add(configPresetArg)
  }

  // -> send a message to the websocket to set a config value
  function sendSetConfigPreset({ category, preset }: ConfigPreset) {
    const msg: SetConfigPresetOutMsg = {
      command: 'set_preset',
      category,
      preset,
    }
    socketStore.sendMessage(msg)
  }

  // -> reset
  function reset() {
    configPresets.value = new Set(defaultConfigPresets)
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    configPresets,
    setConfigPreset,
    sendSetConfigPreset,
    reset,
  }
})
