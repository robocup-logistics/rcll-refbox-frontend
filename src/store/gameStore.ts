import { ref, computed, watch, ComputedRef } from 'vue'
import { defineStore } from 'pinia'

import type { Ref } from 'vue'
import type AwardedPoints from '@/types/AwardedPoints'
import type Gamestate from '@/types/Gamestate'
import type Phase from '@/types/Phase'
import type State from '@/types/State'
import Color from '@/types/Color'
import { useViewStore } from '@/store/viewStore'
import { useSocketStore } from '@/store/socketStore'
import { useMachineStore } from '@/store/machineStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'
import { useReportStore } from '@/store/reportStore'
import { useEventStore } from '@/store/eventStore'

// game store
export const useGameStore = defineStore('gameStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const eventStore = useEventStore()
  const reportStore = useReportStore()
  const socketStore = useSocketStore()
  const machineStore = useMachineStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()
  const viewStore = useViewStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // known teams are fetched from the refbox at the beginning to be
  // able to select them when choosing a team name
  const knownTeams: Ref<string[]> = ref([])

  // name of the current cyan and magenta team - use teamNameByColor to get the
  // name instead of the direct reference in order to also get a placeholder
  // string for not yet set team names
  const nameTeamCyan: Ref<string> = ref('')
  const nameTeamMagenta: Ref<string> = ref('')

  // score and awarded points
  const scoreCyan: Ref<number> = ref(0)
  const scoreMagenta: Ref<number> = ref(0)
  const awardedPoints: Ref<AwardedPoints[]> = ref([])

  // game state
  const phase: Ref<Phase> = ref('PRE_GAME')
  // overall time
  const cont_time: Ref<number> = ref(0)
  // the time within in the current phase
  const game_time: Ref<number> = ref(0)
  // the overtime boolean indicates whether a overtime is taking place. It is
  // initially undefined and is set at when the overtime starts
  const overtime: Ref<boolean> = ref(false)
  const gamestate: Ref<State> = ref('WAIT_START')

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // other color
  const oppositeColor: ComputedRef<(color: Color) => Color> = computed(() => {
    return (color: Color) => {
      if (color == 'CYAN') {
        return 'MAGENTA'
      } else if (color == 'MAGENTA') {
        return 'CYAN'
      } else {
        throw new Error('request opposite of unknown color')
      }
    }
  })

  // team name by color
  const teamNameByColor: ComputedRef<(color: Color) => string> = computed(
    () => {
      return (color: Color) => {
        if (color == 'CYAN') {
          return nameTeamCyan.value ? nameTeamCyan.value : 'CYAN (tbd)'
        } else {
          return nameTeamMagenta.value ? nameTeamMagenta.value : 'MAGENTA (tbd)'
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

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // set gamestate information
  function setGamestateInformation(gamestateArg: Gamestate) {
    nameTeamCyan.value = gamestateArg.cyan
    viewStore.verticalFieldSize = gamestateArg['field_height']
    viewStore.isFieldMirrored = gamestateArg['field_mirrored']
    viewStore.horizontalFieldSize = gamestateArg['field_width']
    game_time.value = Math.trunc(gamestateArg['game_time'])
    cont_time.value = Math.trunc(gamestateArg['cont_time'])
    nameTeamMagenta.value = gamestateArg.magenta
    overtime.value = gamestateArg['over_time']
    phase.value = gamestateArg.phase
    scoreCyan.value = parseInt(gamestateArg['points_cyan'])
    scoreMagenta.value = parseInt(gamestateArg['points_magenta'])
    gamestate.value = gamestateArg.state
  }

  // reset this store
  function reset() {
    knownTeams.value = []
    nameTeamCyan.value = ''
    nameTeamMagenta.value = ''
    scoreCyan.value = 0
    scoreMagenta.value = 0
    awardedPoints.value = []
    phase.value = 'PRE_GAME'
    cont_time.value = 0
    game_time.value = 0
    overtime.value = false
    gamestate.value = 'WAIT_START'
  }

  // reset all stores
  function resetAll() {
    eventStore.reset()
    reportStore.reset()
    socketStore.reset()
    reset()
    machineStore.reset()
    orderStore.reset()
    robotStore.reset()
    viewStore.reset()
  }

  // WATCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> CREATE GAME EVENTS IN RESPONSE TO STATE CHANGES
  // watch team names to create an event when they are set
  watch(
    () => nameTeamCyan.value,
    (newNameTeamCyan, _) => {
      if (newNameTeamCyan) {
        eventStore.createEvent({
          category: 'game',
          icon: 'fa-people-group',
          msg: `${teamNameByColor.value('CYAN')} is playing CYAN`,
          team: 'CYAN',
        })
      }
    }
  )
  watch(
    () => nameTeamMagenta.value,
    (newNameTeamCyan, _) => {
      if (newNameTeamCyan) {
        eventStore.createEvent({
          category: 'game',
          icon: 'fa-people-group',
          msg: `${teamNameByColor.value('MAGENTA')} is playing MAGENTA`,
          team: 'MAGENTA',
        })
      }
    }
  )

  // watch awarded points
  watch(
    () => awardedPoints.value,
    (newAwardedPoints, prevAwardedPoints) => {
      if (prevAwardedPoints && newAwardedPoints) {
        for (
          let i = prevAwardedPoints.length;
          i < newAwardedPoints.length;
          i++
        ) {
          const award = Array.from(newAwardedPoints)[i]
          if (award.points > 0 && teamNameByColor.value(award.team) != '') {
            eventStore.createEvent({
              category: 'game',
              icon: 'fa-trophy',
              msg: `${teamNameByColor.value(award.team)} received ${
                award.points
              } points`,
              team: award.team,
            })
          }
        }
      }
    }
  )

  // watch game state (pausing and remusing)
  watch(
    () => gamestate.value,
    (newState, prevState) => {
      if (prevState == 'RUNNING' && newState == 'PAUSED') {
        eventStore.createEvent({
          category: 'game',
          icon: 'fa-pause',
          msg: 'The game has been paused',
        })
      } else if (prevState == 'PAUSED' && newState == 'RUNNING') {
        eventStore.createEvent({
          category: 'game',
          icon: 'fa-play',
          msg: 'The game has been resumed',
        })
      }
    }
  )

  // watch the phase to create phase change and game end events
  watch(
    () => phase.value,
    (newPhase, _) => {
      if (newPhase) {
        // create phase start events for SETUP and PRODUCTION phases
        if (newPhase == 'SETUP' || newPhase == 'PRODUCTION') {
          eventStore.createEvent({
            category: 'game',
            icon: 'fa-arrow-right',
            msg: `Phase ${newPhase} has started`,
          })
        }
        // create winner event when POST_GAME phase is entered
        else if (newPhase == 'POST_GAME') {
          const winnerTeam =
            scoreByColor.value('CYAN') > scoreByColor.value('MAGENTA')
              ? 'CYAN'
              : scoreByColor.value('CYAN') < scoreByColor.value('MAGENTA')
              ? 'MAGENTA'
              : undefined

          eventStore.createEvent({
            category: 'game',
            icon: 'fa-face-smile',
            msg: winnerTeam
              ? `${teamNameByColor.value(winnerTeam)} has won the game 🥳`
              : 'The game ended with a tie',
            team: winnerTeam,
          })
        }
      }
    },
    { immediate: true }
  )

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    nameTeamCyan,
    nameTeamMagenta,
    knownTeams,
    awardedPoints,
    phase,
    cont_time,
    game_time,
    overtime,
    gamestate,
    oppositeColor,
    teamNameByColor,
    scoreByColor,
    awardedPointsByColor,
    awardedPointsByColorAndOrder,
    setGamestateInformation,
    reset,
    resetAll,
  }
})
