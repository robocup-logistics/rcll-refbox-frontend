import { ref, type Ref, computed, watch, ComputedRef } from 'vue'
import { defineStore } from 'pinia'

import Color from '@/types/Color'
import { useGameStore } from '@/store/gameStore'
import GameEvent from '@/types/GameEvent'

// game store
export const useEventStore = defineStore('eventStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameEvents: Ref<GameEvent[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameEventsFilteredBy: ComputedRef<
    (filter: string | null) => GameEvent[]
  > = computed(() => {
    return (filter: string | null) => {
      return filter
        ? gameEvents.value.filter((gameEvent) => gameEvent.category == filter)
        : gameEvents.value
    }
  })

  // WATCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // create events as a response to situations in the game

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // create new event
  function createEvent({
    category,
    icon = 'fa-question',
    msg,
    team = undefined,
    linkedEl = undefined,
  }: {
    category: 'game' | 'robot' | 'machine'
    icon: string
    msg: string
    team?: Color
    linkedEl?: string
  }) {
    const newEvent: GameEvent = {
      phase: gameStore.phase,
      cont_time: gameStore.cont_time,
      category,
      icon,
      msg,
      team,
      linkedEl,
    }
    gameEvents.value.push(newEvent)
  }

  // reset this store
  function reset() {
    gameEvents.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    gameEvents,
    createEvent,
    gameEventsFilteredBy,
    reset,
  }
})
