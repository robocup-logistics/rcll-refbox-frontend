import { ref, computed, ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import type Reward from '@/types/Reward'
import type Gamestate from '@/types/Gamestate'
import type Phase from '@/types/Phase'
import type State from '@/types/State'
import type Color from '@/types/Color'
import { useSocketStore } from '@/store/socketStore'
import { useEventStore } from '@/store/eventStore'
import { useConfigStore } from '@/store/configStore'
import type TimeInfo from '@/types/TimeInfo'
import type KnownTeams from '@/types/KnownTeams'
import type AddRewardOutMsg from '@/types/messages/outgoing/AddRewardOutMsg'
import type SetTeamNameOutMsg from '@/types/messages/outgoing/SetTeamNameOutMsg'
import type SetGamestateOutMsg from '@/types/messages/outgoing/SetGamestateOutMsg'
import type SetGamephaseOutMsg from '@/types/messages/outgoing/SetGamephaseOutMsg'

// GAME STORE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the game store is the central point of contact for the other stores. In
// addition, it provides general information about and methods to manage the
// game
export const useGameStore = defineStore('gameStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const eventStore = useEventStore()
  const socketStore = useSocketStore()
  const configStore = useConfigStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> known teams
  // they are fetched from the refbox at the beginning to be able to select them
  // when choosing a team name
  const knownTeams: Ref<string[]> = ref([])

  // -> name of the current cyan and magenta team
  // use teamNameByColor to get the name instead of the direct reference in
  // order to also get a placeholder string for not yet set team names
  const nameTeamCyan: Ref<string> = ref('')
  const nameTeamMagenta: Ref<string> = ref('')

  // -> rewards
  const rewards: Ref<Reward[]> = ref([])

  // -> game state
  const phase: Ref<Phase> = ref('PRE_GAME')
  const state: Ref<State> = ref('WAIT_START')

  // -> overall time
  const cont_time: Ref<number> = ref(0)

  // -> the time within in the current phase
  const game_time: Ref<number> = ref(0)

  // -> overtime
  const overtime: Ref<boolean> = ref(false)

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> config
  const SETUP_DURATION: ComputedRef<number> = computed(
    () => <number>configStore.gameConfig.get('/llsfrb/globals/setup_time')
  )
  const PRODUCTION_DURATION: ComputedRef<number> = computed(
    () => <number>configStore.gameConfig.get('/llsfrb/globals/production_time')
  )
  const EXPLORATION_DURATION: ComputedRef<number> = computed(
    () =>
      <number>configStore.gameConfig.get('/llsfrb/game/field/exploration_time')
  )
  const OVERTIME_DURATION: ComputedRef<number> = computed(
    () =>
      <number>configStore.gameConfig.get('/llsfrb/globals/production_overtime')
  )
  const PHASES: ComputedRef<string[]> = computed(
    () => <string[]>configStore.gameConfig.get('/llsfrb/globals/phases')
  )

  // -> other color
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

  // -> team name by color
  const teamNameByColor: ComputedRef<(color: Color) => string> = computed(
    () => {
      return (color: Color) => {
        if (color == 'CYAN') {
          return nameTeamCyan.value ? nameTeamCyan.value : 'CYAN'
        } else {
          return nameTeamMagenta.value ? nameTeamMagenta.value : 'MAGENTA'
        }
      }
    }
  )

  // -> score by color
  const scoreByColor: ComputedRef<(color: Color) => number> = computed(() => {
    return (color: Color) => {
      return rewards.value
        .filter((reward) => reward.team == color)
        .reduce((acc, reward) => acc + reward.points, 0)
    }
  })

  // -> rewards by color
  const rewardsByColor: ComputedRef<(color: Color) => Reward[]> = computed(
    () => {
      return (color: Color) =>
        rewards.value.filter((rewardFi) => rewardFi.team == color)
    }
  )

  // -> rewards by color and order
  const rewardsByColorAndOrder: ComputedRef<
    (color: Color, orderId: number) => Reward[]
  > = computed(() => {
    return (color: Color, orderId: number) =>
      rewards.value.filter(
        (rewardFi) => rewardFi.team == color && rewardFi.order == orderId
      )
  })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> set known teams
  function setKnownTeams(knownTeamsArg: KnownTeams) {
    knownTeams.value = knownTeamsArg.known_teams.sort()
  }

  // -> set time
  function setTime(timeArg: TimeInfo) {
    game_time.value = Math.trunc(timeArg.game_time)
    cont_time.value = Math.trunc(timeArg.cont_time)
  }

  // -> set gamestate - during the update, check if we need to create events
  function setGamestate(gamestateArg: Gamestate) {
    // -> team names
    if (!nameTeamCyan.value && gamestateArg.cyan) {
      eventStore.addEvent({
        icon: 'fa-people-group',
        msg: `${gamestateArg.cyan} is playing CYAN`,
        team: 'CYAN',
      })
    }
    if (!nameTeamMagenta.value && gamestateArg.magenta) {
      eventStore.addEvent({
        icon: 'fa-people-group',
        msg: `${gamestateArg.magenta} is playing MAGENTA`,
        team: 'MAGENTA',
      })
    }
    nameTeamCyan.value = gamestateArg.cyan
    nameTeamMagenta.value = gamestateArg.magenta

    // -> state (running/paused)
    if (state.value == 'RUNNING' && gamestateArg.state == 'PAUSED') {
      eventStore.addEvent({
        icon: 'fa-pause',
        msg: 'The game has been paused',
      })
    } else if (state.value == 'PAUSED' && gamestateArg.state == 'RUNNING') {
      eventStore.addEvent({
        icon: 'fa-play',
        msg: 'The game has been resumed',
      })
    }
    state.value = gamestateArg.state

    // -> phase and overtime
    if (phase.value != gamestateArg.phase) {
      // create phase start events for SETUP and PRODUCTION phases
      if (gamestateArg.phase == 'SETUP' || gamestateArg.phase == 'PRODUCTION') {
        eventStore.addEvent({
          icon: 'fa-arrow-right',
          msg: `Phase ${gamestateArg.phase} has started`,
        })
      }
      // create winner event when POST_GAME phase is entered
      else if (gamestateArg.phase == 'POST_GAME') {
        const winnerTeam =
          scoreByColor.value('CYAN') > scoreByColor.value('MAGENTA')
            ? 'CYAN'
            : scoreByColor.value('CYAN') < scoreByColor.value('MAGENTA')
            ? 'MAGENTA'
            : undefined

        eventStore.addEvent({
          icon: 'fa-medal',
          msg: winnerTeam
            ? `${teamNameByColor.value(winnerTeam)} has won the game 🥳`
            : 'The game ended with a tie',
        })
      }
    }
    overtime.value = gamestateArg.over_time
    phase.value = gamestateArg.phase
  }

  // -> add a reward
  function addReward(rewardArg: Reward) {
    if (rewardArg.points > 0 && teamNameByColor.value(rewardArg.team) != '') {
      eventStore.addEvent({
        icon: 'fa-trophy',
        msg: `${teamNameByColor.value(rewardArg.team)} received ${
          rewardArg.points
        } points`,
        team: rewardArg.team,
      })
    }
    rewards.value.push(rewardArg)
  }

  // -> send a websocket message to ...
  // ---> ... set a team name
  function sendSetTeamName({ color, name }: { color: Color; name: string }) {
    const msg: SetTeamNameOutMsg = {
      command: 'set_teamname',
      color,
      name,
    }
    socketStore.sendMessage(msg)
  }

  // ---> ... set the phase
  function sendSetPhase(newPhase: Phase) {
    const msg: SetGamephaseOutMsg = {
      command: 'set_gamephase',
      phase: `${newPhase}`,
    }
    socketStore.sendMessage(msg)
  }

  // ---> ... set the state
  function sendSetGamestate(newState: State) {
    const msg: SetGamestateOutMsg = {
      command: 'set_gamestate',
      state: `${newState}`,
    }
    socketStore.sendMessage(msg)
  }

  // ---> ... add a reward
  function sendAddReward({
    points,
    team_color,
    reason,
  }: {
    points: number
    team_color: Color
    reason: string
  }) {
    const msg: AddRewardOutMsg = {
      command: 'add_points_team',
      points,
      team_color,
      game_time: game_time.value,
      phase: phase.value,
      reason,
    }

    socketStore.sendMessage(msg)
  }

  // -> reset this store
  function reset() {
    knownTeams.value = []
    nameTeamCyan.value = ''
    nameTeamMagenta.value = ''
    rewards.value = []
    phase.value = 'PRE_GAME'
    cont_time.value = 0
    game_time.value = 0
    overtime.value = false
    state.value = 'WAIT_START'
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    nameTeamCyan,
    nameTeamMagenta,
    knownTeams,
    rewards,
    phase,
    cont_time,
    game_time,
    overtime,
    state,
    SETUP_DURATION,
    PRODUCTION_DURATION,
    EXPLORATION_DURATION,
    OVERTIME_DURATION,
    PHASES,
    oppositeColor,
    teamNameByColor,
    scoreByColor,
    rewardsByColor,
    rewardsByColorAndOrder,
    setKnownTeams,
    setTime,
    setGamestate,
    addReward,
    sendSetTeamName,
    sendSetPhase,
    sendSetGamestate,
    sendAddReward,
    reset,
  }
})
