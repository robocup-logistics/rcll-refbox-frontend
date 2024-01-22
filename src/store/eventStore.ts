import { ref, type Ref, computed, watch, ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import type GameEvent from '@/types/GameEvent'
import type Phase from '@/types/Phase'
import type Color from '@/types/Color'

// EVENT STORE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// this store is used to manage game events that are currently just displayed in
// form of a log spectator frontend. In contrast to the raw messages log, the
// log of game events should only contain the most important information about
// what is happening and be less detailed.
export const useEventStore = defineStore('eventStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> game events
  const gameEvents: Ref<GameEvent[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> filtered game events
  const filteredGameEvents: ComputedRef<(filter: string) => GameEvent[]> =
    computed(() => {
      return (filter: string) => {
        switch (filter) {
          case 'all':
            return gameEvents.value
          case 'game':
            return gameEvents.value.filter((gameEvent) => !gameEvent.team)
          case 'cyan':
            return gameEvents.value.filter(
              (gameEvent) => gameEvent.team == 'CYAN'
            )
          case 'magenta':
            return gameEvents.value.filter(
              (gameEvent) => gameEvent.team == 'MAGENTA'
            )
          default:
            return gameEvents.value
        }
      }
    })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // add a new event
  function addEvent({
    phase = gameStore.phase,
    cont_time = gameStore.cont_time,
    icon = 'fa-question',
    msg,
    team = undefined,
  }: {
    phase?: Phase
    cont_time?: number
    icon: string
    msg: string
    team?: Color
  }) {
    gameEvents.value.push({
      phase,
      cont_time,
      icon,
      msg,
      team,
    })
  }

  // reset this store
  function reset() {
    gameEvents.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    gameEvents,
    addEvent,
    filteredGameEvents,
    reset,
  }
})
