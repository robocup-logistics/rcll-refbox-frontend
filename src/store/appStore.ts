import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useMachineStore } from '@/store/machineStore'
import { useConfigStore } from '@/store/configStore'
import { usePresetStore } from '@/store/presetStore'
import { useSocketStore } from '@/store/socketStore'
import { useReportStore } from '@/store/reportStore'
import { useEventStore } from '@/store/eventStore'
import { useGameStore } from '@/store/gameStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'
import { useFieldStore } from '@/store/fieldStore'

// APP STORE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the app store is the main store of the application. It contains all
// information not directly associated with the game but with the way the app
// maanges some aspects.
export const useAppStore = defineStore('appStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const machineStore = useMachineStore()
  const configStore = useConfigStore()
  const socketStore = useSocketStore()
  const presetStore = usePresetStore()
  const reportStore = useReportStore()
  const eventStore = useEventStore()
  const gameStore = useGameStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()
  const fieldStore = useFieldStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> advanced options
  // while there is no authentication required to send messages to the refbox
  // (such as giving points), we need some method such as a hidden keyboard
  // shortcut to prevent users from going into referee mode and doing such
  // things. As soon as this keyboard shortcut is pressed, all options are
  // unlocked and the user can e.g. switch to the referee mode, edit the socket
  // connection and load game reports
  const advancedOptions: Ref<boolean> = ref(false)

  // -> current view & current mode
  // Because the spectator view is used for both watching live games and
  // reviewing game reports, we need an additional way to determine which of the
  // modes is active in order to render some mode-specific information or
  // options. While we could check for an active socket or a stored game report,
  // we might also want to support the socket view when there is no active
  // socket because the connection was temporarily lost
  const currentView: Ref<'start' | 'spectator' | 'referee'> = ref('start')
  const currentMode: Ref<'socket' | 'gameReport'> = ref('socket')

  // -> popup counter
  // current z-index for newly opened popups (gets higher with each popup
  // toggle). Used because newly opened popups should be displayed above
  // previously opened
  const popupCounter: Ref<number> = ref(10)

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> reset this store
  function reset() {
    // do not change advancedOptions and Referee view values because we want to
    // preserve the current view and options when we call reset
    popupCounter.value = 10
  }

  // -> reset all stores
  function resetAll() {
    reportStore.reset()
    socketStore.reset()
    configStore.reset()
    presetStore.reset()
    eventStore.reset()
    gameStore.reset()
    machineStore.reset()
    orderStore.reset()
    robotStore.reset()
    fieldStore.reset()
    reset()
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    advancedOptions,
    currentView,
    currentMode,
    popupCounter,
    reset,
    resetAll,
  }
})
