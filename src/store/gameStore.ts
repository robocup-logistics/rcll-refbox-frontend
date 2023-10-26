import { ref, computed, watch, ComputedRef } from 'vue'
import { defineStore } from 'pinia'

import type { Ref } from 'vue'
import type AwardedPoints from '@/types/AwardedPoints'
import type Gamestate from '@/types/Gamestate'
import type Phase from '@/types/Phase'
import type State from '@/types/State'
import { useRuleStore } from '@/store/ruleStore'
import Color from '@/types/Color'
import { useViewStore } from '@/store/viewStore'

// game store
export const useGameStore = defineStore('gameStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const ruleStore = useRuleStore()
  const viewStore = useViewStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // known teams are fetched from the refbox at the beginning to be
  // able to select them when choosing a team name
  const knownTeams: Ref<string[]> = ref([])

  // name of the current cyan and magenta team
  const nameTeamCyan: Ref<string> = ref('')
  const nameTeamMagenta: Ref<string> = ref('')

  // score and awarded points
  const scoreCyan: Ref<number> = ref(0)
  const scoreMagenta: Ref<number> = ref(0)
  const awardedPoints: Ref<AwardedPoints[]> = ref([])

  // game state (todo: game state is currently used for the gamestate (e.g.
  // WAIT_START) but also used as a term to describe the whole state of the game
  // including e.g. phase - find better terms!)
  const phase: Ref<Phase> = ref('PRE_GAME')
  const gametime: Ref<number> = ref(0)
  // the overtime boolean indicates whether a overtime is taking place. It is
  // initially undefined and is set at when the overtime starts (resp. would but
  // does not start)
  const overtime: Ref<boolean> = ref(false)
  const gamestate: Ref<State> = ref('WAIT_START')

  // WATCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // determine whether an overtime is taking place at the end of the production
  // phase
  /* watch(gametime, (newGametime) => {
    if (
      newGametime >= ruleStore.PRODUCTION_DURATION &&
      overtime.value == undefined
    ) {
      if (scoreCyan.value == scoreMagenta.value) {
        overtime.value = true
      } else {
        overtime.value = false
      }
    }
  }) */

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // team name by color
  const teamNameByColor: ComputedRef<(color: Color) => string> = computed(
    () => {
      return (color: Color) => {
        if (color == 'CYAN') {
          return nameTeamCyan.value
        } else {
          return nameTeamMagenta.value
        }
      }
    }
  )

  // score by color
  const scoreByColor: ComputedRef<(color: Color) => number> = computed(() => {
    return (color: Color) => {
      if (color == 'CYAN') {
        return scoreCyan.value
      } else {
        return scoreMagenta.value
      }
    }
  })

  // awarded points by color
  const awardedPointsByColor: ComputedRef<(color: Color) => AwardedPoints[]> =
    computed(() => {
      return (color: Color) =>
        awardedPoints.value.filter(
          (awardedPointsFi) => awardedPointsFi.team == color
        )
    })

  // awarded points by color and order
  const awardedPointsByColorAndOrder: ComputedRef<
    (color: Color, orderId: number) => AwardedPoints[]
  > = computed(() => {
    return (color: Color, orderId: number) =>
      awardedPoints.value.filter(
        (awardedPointsFi) =>
          awardedPointsFi.team == color && awardedPointsFi.order == orderId
      )
  })

  const totalTime: ComputedRef<number> = computed(() => {
    if (phase.value == 'PRE_GAME') {
      return 0
    } else if (phase.value == 'SETUP') {
      return gametime.value
    } else if (phase.value == 'PRODUCTION' || phase.value == 'POST_GAME') {
      return ruleStore.SETUP_DURATION + gametime.value
    } else {
      return 999999999999999
    }
  })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // set gamestate information
  function setGamestateInformation(gamestateArg: Gamestate) {
    nameTeamCyan.value = gamestateArg.cyan
    viewStore.verticalFieldSize = gamestateArg['field_height']
    viewStore.isFieldMirrored = gamestateArg['field_mirrored']
    viewStore.horizontalFieldSize = gamestateArg['field_width']
    gametime.value = Math.trunc(gamestateArg['game_time'])
    nameTeamMagenta.value = gamestateArg.magenta
    overtime.value = gamestateArg['over_time']
    phase.value = gamestateArg.phase
    scoreCyan.value = parseInt(gamestateArg['points_cyan'])
    scoreMagenta.value = parseInt(gamestateArg['points_magenta'])
    gamestate.value = gamestateArg.state
  }

  function reset() {
    knownTeams.value = []
    nameTeamCyan.value = ''
    nameTeamMagenta.value = ''
    scoreCyan.value = 0
    scoreMagenta.value = 0
    awardedPoints.value = []
    phase.value = 'PRE_GAME'
    gametime.value = 0
    overtime.value = false
    gamestate.value = 'WAIT_START'
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    knownTeams,
    awardedPoints,
    phase,
    gametime,
    overtime,
    gamestate,
    teamNameByColor,
    scoreByColor,
    awardedPointsByColor,
    awardedPointsByColorAndOrder,
    totalTime,
    setGamestateInformation,
    reset,
  }
})
