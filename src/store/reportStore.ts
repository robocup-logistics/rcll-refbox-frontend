import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ComputedRef, Ref } from 'vue'
import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'
import type GameReport from '@/types/GameReport'
import type Reward from '@/types/Reward'
import type AgentTask from '@/types/AgentTask'
import type Workpiece from '@/types/Workpiece'
import type Machine from '@/types/Machine'
import { useAppStore } from '@/store/appStore'
import { useConfigStore } from '@/store/configStore'

// REPORT STORE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the report store is used to establish a database connection, retrieve game
// reports and manage a simulation of a game when opening a game report
export const useReportStore = defineStore('reportStore', () => {
  // use other stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()
  const machineStore = useMachineStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()
  const appStore = useAppStore()
  const configStore = useConfigStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> consts
  const DEFAULT_BACKEND_URL: Ref<string> = ref('http://localhost:8085')
  const MIN_VERSION: Ref<string> = ref('2')
  const MAX_VERSION: Ref<string> = ref('2')

  // -> general settings
  const gameSpeed: Ref<number> = ref(1)

  // -> selecting a report
  const loadingReportsList: Ref<boolean> = ref(false)
  const gameReportsList: Ref<GameReport[]> = ref([])
  const incompatibleCount: Ref<number> = ref(0)
  const loadingReport: Ref<boolean> = ref(false)

  // -> current game
  const gameReport: Ref<GameReport | undefined> = ref(undefined)
  const gameStateIndex: Ref<number> = ref(0)
  const rewardsIndex: Ref<number> = ref(0)
  const machineHistoryIndex: Ref<number> = ref(0)
  const shelfSlotHistoryIndex: Ref<number> = ref(0)
  const robotHistoryIndex: Ref<number> = ref(0)

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // while the scoreByColor function serves the purpose of calculating the
  // team's scores based on the current rewards in the game store, we need an
  // utility function to serve the same purpose for a list of rewards that is
  // not officially set yet (e.g. we want to see the different scores when
  // selecting a game report from a list)
  const scoreByColor: ComputedRef<(team: String, rewards: Reward[]) => number> =
    computed(() => {
      return (team: String, rewards: Reward[]) => {
        return (
          rewards
            ?.filter((reward: Reward) => reward.team == team)
            .map((reward: Reward) => reward.points)
            .reduce((acc: number, cur: number) => acc + cur, 0) || 0
        )
      }
    })

  const activeAgentTasks: ComputedRef<AgentTask[]> = computed(() => {
    return gameStore.phase == 'PRODUCTION'
      ? gameReport.value?.agent_task_history.filter(
          (agentTask) =>
            gameStore.game_time >= agentTask.start_time &&
            gameStore.game_time <= agentTask.end_time,
        ) || []
      : []
  })

  const activeWorkpieces: ComputedRef<Workpiece[]> = computed(() => {
    return gameStore.phase == 'PRODUCTION'
      ? gameReport.value?.workpiece_history.filter(
          (workpiece) =>
            gameStore.game_time >= workpiece.start_time &&
            gameStore.game_time <= workpiece.end_time,
        ) || []
      : []
  })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> request game reports list
  // the first step in getting a game report is to retrieve the list of game
  // reports. Therefore, a request is sent to the backend, mentioning the
  // supported game report versions, and a list of these game reports is
  // returned
  async function requestGameReportsList(baseUrl: string) {
    loadingReportsList.value = true
    gameReportsList.value = []
    let response, responseJSON
    try {
      response = await fetch(
        `${baseUrl}/api/getReportsList?` +
          new URLSearchParams({
            min_version: MIN_VERSION.value,
            max_version: MAX_VERSION.value,
          }),
      )
      responseJSON = <{ reports: GameReport[]; incompatibleCount: number }>(
        await response.json()
      )
    } catch (err) {
      console.error(err)
      if (response && response.status != 200) {
        alert(
          `Something went wrong. Response: ${response?.status} - ${response?.statusText}`,
        )
      } else {
        alert(
          'Could not connect: Have you specified the right URL and made sure the game report provider is started?',
        )
      }
    } finally {
      loadingReportsList.value = false
    }
    if (responseJSON) {
      gameReportsList.value = responseJSON.reports
      incompatibleCount.value = responseJSON.incompatibleCount
    }
  }

  // -> request a game report
  // when the user select a report in the list of available game reports, a
  // second request is made to the backend which returns the full selected game
  // report. After the game report is returned, we further process it
  async function requestGameReport(baseUrl: string, reportId: string) {
    loadingReport.value = true
    let response, newGameReport
    try {
      response = await fetch(
        `${baseUrl}/api/getReportById?` +
          new URLSearchParams({
            reportId,
          }),
      )
      newGameReport = <GameReport>await response.json()
    } catch (err) {
      console.error(err)
      if (response && !response?.ok) {
        alert(
          `Something went wrong. Response: ${response?.status} - ${response?.statusText}`,
        )
      } else {
        alert('Unknown connection error')
      }
    } finally {
      loadingReport.value = false
    }
    // apply the information of the new game report throughout the app
    if (newGameReport) {
      // select the game
      gameReport.value = newGameReport
      appStore.currentMode = 'gameReport'

      // add a shortcut for the game end time (might be added in a future game
      // report version)
      gameReport.value.game_end_time =
        gameReport.value.gamestate_history.slice(-1)[0].cont_time

      // further prepare the game start (while the previous things need to be
      // just once after loading a game report - they will not be overwritten -
      // the things that are happening now need to be repeated each time we go
      // back in time)
      initGame()
    }
  }

  // -> initialize the game
  // this runs all intializations game variables, robots, machines, orders
  function initGame() {
    if (gameReport.value) {
      // reset everything but the game report
      const gameReportTemp = gameReport.value
      appStore.resetAll()
      gameReport.value = gameReportTemp

      // set initial gamestate
      gameStore.setGamestate({
        cyan: gameReport.value.teams[0],
        magenta: gameReport.value.teams[1],
        over_time: false,
        phase: 'PRE_GAME',
        state: 'WAIT_START',
      })

      // set config
      // @todo maybe try to convert the whole config objects
      configStore.setConfigValue({
        path: '/llsfrb/game/field/height',
        value: gameReport.value.config.find(
          (cfg) => cfg.path == '/llsfrb/game/field/height',
        )?.value,
      })
      configStore.setConfigValue({
        path: '/llsfrb/game/field/mirrored',
        value: gameReport.value.config.find(
          (cfg) => cfg.path == '/llsfrb/game/field/mirrored',
        )?.value,
      })
      configStore.setConfigValue({
        path: '/llsfrb/game/field/width',
        value: gameReport.value.config.find(
          (cfg) => cfg.path == '/llsfrb/game/field/width',
        )?.value,
      })

      // set orders
      for (const order of gameReport.value.orders) {
        order.quantity_delivered = [0, 0]
        order.unconfirmed_deliveries = []
        orderStore.setOrder(order)
      }

      // set machines
      for (const machineFo of gameReport.value.machines) {
        let machine = {
          mtype: machineFo.mtype,
          name: machineFo.name,
          rotation: machineFo.rotation,
          state: 'IDLE',
          team: machineFo.team,
          zone: machineFo.zone,
          available_colors:
            machineFo.mtype == 'RS' ? machineFo.available_colors : undefined,
        }
        machineStore.setMachine(<Machine>machine)
      }

      // set ring specs
      machineStore.ringSpecs = gameReport.value.ring_specs

      // @TODO it might make sense to already set some additional information
      // from the history arrays here, like the initial shelf slots.
    }
  }

  // -> run the game (either from the beginning or a paused state)
  // set the state to running and peform one game step after each other
  function runGame() {
    // if the game has reached the end, start from the beginning
    if (gameStore.phase == 'POST_GAME') {
      initGame()
    }

    // run the game
    gameStore.state = 'RUNNING'
    function nextStep() {
      setTimeout(() => {
        if (gameStore.state == 'RUNNING') {
          gameStep()
          nextStep()
        }
      }, 1000 / gameSpeed.value)
    }
    nextStep()
  }

  // -> jump to a given cont time
  function jumpTo(contTime: number) {
    // first set the state to paused, so there are no complications with the
    // possible currently running game start from the beginning if the time is
    // before noew
    if (contTime < gameStore.cont_time) {
      initGame()
    }
    // perform game steps until the desired time is reached
    while (gameStore.cont_time < contTime) {
      gameStep()
    }
  }

  // -> perform a game step: a game step involves increasing the time and
  // performing checks and changes that go together with the new time
  function gameStep() {
    if (gameReport.value) {
      // check if entries in the gamestate history need to be applied
      while (
        gameReport.value.gamestate_history[gameStateIndex.value] &&
        gameReport.value.gamestate_history[gameStateIndex.value].cont_time <=
          gameStore.cont_time
      ) {
        // an entry in the gamestate history is created when either state or
        // phase changes or the overtime is activated. We ignore state changes
        // since the user controls the state him-/herself and we are not
        // interested in the original times the game has been paused and resumed
        if (
          gameStore.phase !=
          gameReport.value.gamestate_history[gameStateIndex.value].phase
        ) {
          gameStore.game_time = 0
        }

        gameStore.setGamestate({
          cyan: gameStore.nameTeamCyan,
          magenta: gameStore.nameTeamMagenta,
          over_time:
            gameReport.value.gamestate_history[gameStateIndex.value].over_time,
          phase: gameReport.value.gamestate_history[gameStateIndex.value].phase,
          state: gameStore.state,
        })

        // we are done with this entry, so next time check for the next one
        gameStateIndex.value += 1
      }

      // with the start of the production phase, we need to take a look at a few
      // more histories
      if (gameStore.phase == 'PRODUCTION') {
        // -> reward history
        // check for new rewards
        while (
          gameReport.value.points[rewardsIndex.value] &&
          gameReport.value.points[rewardsIndex.value].game_time <=
            gameStore.game_time
        ) {
          gameStore.addReward(gameReport.value.points[rewardsIndex.value])
          rewardsIndex.value += 1
        }

        // -> machine history
        // check for all machine-related changes
        while (
          gameReport.value.machine_history[machineHistoryIndex.value] &&
          gameReport.value.machine_history[machineHistoryIndex.value]
            .game_time <= gameStore.game_time
        ) {
          const newMachineCurrent =
            gameReport.value.machine_history[machineHistoryIndex.value]
          const machine = machineStore.machines.find(
            (machineFi) => machineFi.name == newMachineCurrent.name,
          )
          if (machine) {
            // we do not rewrite the whole machine object because the machine
            // history lacks the static machine information which would get lost
            // on overwrite. Instead, we loop through the properties of the new
            // object but skip the unnecessary ones
            for (const [key, value] of Object.entries(newMachineCurrent)) {
              if (
                [
                  'game_time',
                  'is_latest',
                  'time',
                  'fact_string',
                  'meta_fact_string',
                ].includes(key)
              ) {
                continue
              } else {
                // @ts-ignore
                machine[key] = value
              }
            }
            machineStore.setMachine(machine)

            // since there is no seperate history about when and by whom orders
            // were fulfilled, we retrieve this information from the delivery
            // stations:
            if (
              machine.mtype == 'DS' &&
              machine.state == 'PROCESSED' &&
              machine.order_id != 0
            ) {
              const order = orderStore.orders.find(
                (order) => order.id == machine.order_id,
              )
              if (!order) {
                throw new Error(
                  'order referenced in delivery station not found by id',
                )
              } else {
                const orderDeliveredIndex = machine.team == 'CYAN' ? 0 : 1
                order.quantity_delivered[orderDeliveredIndex] += 1
              }
            }
          } else {
            throw new Error(
              'Machine in machine history array not found in machines store',
            )
          }
          machineHistoryIndex.value += 1
        }

        // -> shelf slot history
        // check
        while (
          gameReport.value.shelf_slot_history[shelfSlotHistoryIndex.value] &&
          gameReport.value.shelf_slot_history[shelfSlotHistoryIndex.value]
            .game_time <= gameStore.game_time
        ) {
          machineStore.setShelfSlot(
            gameReport.value.shelf_slot_history[shelfSlotHistoryIndex.value],
          )
          shelfSlotHistoryIndex.value += 1
        }

        // -> robot history
        while (
          gameReport.value.robot_history[robotHistoryIndex.value] &&
          gameReport.value.robot_history[robotHistoryIndex.value].game_time <=
            gameStore.game_time
        ) {
          robotStore.setRobot(
            gameReport.value.robot_history[robotHistoryIndex.value],
          )
          robotHistoryIndex.value += 1
        }
      }

      // advance in time
      gameStore.game_time += 1
      gameStore.cont_time += 1
    } else {
      throw new Error('requested game step but no game report is available!')
    }
  }

  // -> reset this store
  function reset() {
    // do not change the game speed since this can persist
    loadingReportsList.value = false
    gameReportsList.value = []
    incompatibleCount.value = 0
    loadingReport.value = false
    gameReport.value = undefined
    gameStateIndex.value = 0
    rewardsIndex.value = 0
    machineHistoryIndex.value = 0
    shelfSlotHistoryIndex.value = 0
    robotHistoryIndex.value = 0
  }

  // WATCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // whenever the computed property `activeAgentTasks` changes, update the
  // current agent tasks
  watch(
    () => activeAgentTasks.value,
    (newActiveAgentTasks, _) => {
      robotStore.agentTasks = newActiveAgentTasks
    },
    { deep: true },
  )

  // whenever the computed property `activeWorkpieces` changes, update the
  // current workpieces
  watch(
    () => activeWorkpieces.value,
    (newWorkpieces, _) => {
      orderStore.workpieces = newWorkpieces
    },
    { deep: true },
  )

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    DEFAULT_BACKEND_URL,
    loadingReportsList,
    gameReportsList,
    incompatibleCount,
    loadingReport,
    gameReport,
    gameSpeed,
    scoreByColor,
    requestGameReportsList,
    requestGameReport,
    runGame,
    jumpTo,
    reset,
  }
})
