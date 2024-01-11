import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import type { ComputedRef, Ref } from 'vue'

import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'
import type GameReport from '@/types/GameReport'
import type AwardedPoints from '@/types/AwardedPoints'
import type AgentTask from '@/types/AgentTask'
import type Workpiece from '@/types/Workpiece'

// this report store is used to access data and methods related to a database
// connection instead of a live game
export const useReportStore = defineStore('reportStore', () => {
  // use other stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()
  const machineStore = useMachineStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()

  // CONSTS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const DEFAULT_BACKEND_URL: Ref<string> = ref('http://localhost:8085')
  const MIN_VERSION: Ref<string> = ref('2')
  const MAX_VERSION: Ref<string> = ref('2')

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> general settings
  const gameSpeed: Ref<number> = ref(1)
  // -> selecting a repor
  const loadingReportsList: Ref<boolean> = ref(false)
  const gameReportsList: Ref<GameReport[]> = ref([])
  const loadingReport: Ref<boolean> = ref(false)
  // -> current game
  const gameReport: Ref<GameReport | undefined> = ref(undefined)
  const gameStateIndex: Ref<number> = ref(0)
  const robotPoseIndex: Ref<number> = ref(0)

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const pointsByTeam: ComputedRef<
    (team: String, awardedPoints?: AwardedPoints[]) => number
  > = computed(() => {
    return (
      team: String,
      awardedPoints: AwardedPoints[] | undefined = gameReport.value?.points
    ) => {
      return (
        awardedPoints
          ?.filter((points: AwardedPoints) => points.team == team)
          .map((points: AwardedPoints) => points.points)
          .reduce((acc: number, cur: number) => acc + cur, 0) || 0
      )
    }
  })

  const activeAgentTasks: ComputedRef<AgentTask[]> = computed(() => {
    return gameStore.phase == 'PRODUCTION'
      ? gameReport.value?.agent_task_history.filter(
          (agentTask) =>
            gameStore.game_time >= agentTask.start_time &&
            gameStore.game_time <= agentTask.end_time
        ) || []
      : []
  })

  const activeWorkpieces: ComputedRef<Workpiece[]> = computed(() => {
    return gameStore.phase == 'PRODUCTION'
      ? gameReport.value?.workpiece_history.filter(
          (workpiece) =>
            gameStore.game_time >= workpiece.start_time &&
            gameStore.game_time <= workpiece.end_time
        ) || []
      : []
  })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async function requestGameReportsList(baseUrl: string) {
    loadingReportsList.value = true
    gameReportsList.value = []
    let response
    try {
      response = await fetch(
        `${baseUrl}/api/getReportsList?` +
          new URLSearchParams({
            min_version: MIN_VERSION.value,
            max_version: MAX_VERSION.value,
          })
      )
      console.log(response)
      gameReportsList.value = <GameReport[]>await response.json()
    } catch (err) {
      console.error(err)
      if (response && response.status != 200) {
        alert(
          `Something went wrong. Response: ${response?.status} - ${response?.statusText}`
        )
      } else {
        alert(
          'Could not connect: Have you specified the right URL and made sure the MongoDB backend is started?'
        )
      }
    } finally {
      loadingReportsList.value = false
    }
  }

  async function requestGameReport(baseUrl: string, reportId: string) {
    loadingReport.value = true
    let response, newGameReport
    try {
      response = await fetch(
        `${baseUrl}/api/getReportById?` +
          new URLSearchParams({
            reportId,
          })
      )
      newGameReport = <any>await response.json()
    } catch (err) {
      console.error(err)
      if (response && !response?.ok) {
        alert(
          `Something went wrong. Response: ${response?.status} - ${response?.statusText}`
        )
      } else {
        alert('Unknown connection error')
      }
    } finally {
      loadingReport.value = false
    }
    // apply the information of the new game report throughout the app
    if (newGameReport) {
      // reset the stores
      gameStore.resetAll()
      // select the new game report
      gameReport.value = newGameReport
      // set gamestate information
      console.log(newGameReport.teams)
      gameStore.setGamestateInformation({
        cyan: newGameReport.teams[0],
        field_height: newGameReport.config.find(
          (cfg) => cfg.path == '/llsfrb/game/field/height'
        ).value,
        field_mirrored: newGameReport.config.find(
          (cfg) => cfg.path == '/llsfrb/game/field/mirrored'
        ).value,
        field_width: newGameReport.config.find(
          (cfg) => cfg.path == '/llsfrb/game/field/width'
        ).value,
        game_time: 0,
        cont_time: 0,
        magenta: newGameReport.teams[1],
        over_time: false,
        phase: 'PRE_GAME',
        points_cyan: '0',
        points_magenta: '0',
        state: 'WAIT_START',
      })
      // set orders
      for (const order of newGameReport.orders) {
        order['quantity_delivered'] = [0, 0]
        order['unconfirmed_deliveries'] = []
        orderStore.setOrder(order)
      }
      // set machines
      for (const machine of newGameReport['machines']) {
        const machineMeta = newGameReport['machine_meta'].find(
          (machineFi) => machineFi['name'] == machine['name']
        )
        machineStore.setMachine({
          mtype: machine['mtype'],
          name: machine['name'],
          rotation: machine['rotation'],
          state: machine['state'],
          team: machine['team'],
          zone: machine['zone'],
          bs_color: machineMeta?.['bs_color'],
          bs_side: machineMeta?.['bs_side'],
          cs_cap_color: machineMeta?.['cs_cap_color'],
          cs_operation: machineMeta?.['cs_operation'],
          cs_retrieved: machineMeta?.['cs_retrieved'],
          ds_gate: machineMeta?.['ds_gate'],
          ds_order: machineMeta?.['order_id'],
          bases_added: machineMeta?.['bases_added'],
          bases_used: machineMeta?.['bases_used'],
          rs_ring_color: machineMeta?.['rs_ring_color'],
          rs_ring_colors: machineMeta?.['rs_ring_colors'],
        })
      }
      // set ring specs
      machineStore.setringSpecs(newGameReport['ring_specs'])
    }
  }

  function runGame() {
    gameStore.gamestate = 'RUNNING'
    gameStep()
  }

  function gameStep() {
    if (gameReport.value) {
      // set a timer so that after a fixed time span the next game step
      // corresponding to 1 second game time is run
      setTimeout(() => {
        gameStore.game_time += 1
        gameStore.cont_time += 1
        if (gameStore.gamestate == 'RUNNING') {
          gameStep()
        }
      }, 1000 / gameSpeed.value)

      // check game state news
      while (
        gameReport.value.gamestate_history[gameStateIndex.value].cont_time <=
        gameStore.cont_time
      ) {
        gameStore.gamestate =
          gameReport.value.gamestate_history[gameStateIndex.value].state
        gameStore.phase =
          gameReport.value.gamestate_history[gameStateIndex.value].phase
        gameStore.game_time =
          gameReport.value.gamestate_history[gameStateIndex.value].game_time
        gameStore.overtime =
          gameReport.value.gamestate_history[gameStateIndex.value].over_time

        gameStateIndex.value += 1
      }

      // check robot news
      if (gameStore.phase == 'PRODUCTION') {
        // -> position
        while (
          gameReport.value.robot_pose_history[robotPoseIndex.value].time <=
          gameStore.game_time
        ) {
          const historyItem =
            gameReport.value.robot_pose_history[robotPoseIndex.value]
          robotStore.setRobot({
            host: '', // @TODO - backend
            last_seen: ['0', '0'], // @TODO - backend
            maintenance_cylces: 0, // @TODO - backend
            'maintenance_start-time': 0, // @TODO - backend
            maintenance_warning_sent: false, // @TODO - backend
            name: 'robot', // @TODO - backend
            number: historyItem.robot_id,
            port: 4444, // @TODO - backend
            pose: [
              historyItem.x.toString(),
              historyItem.y.toString(),
              historyItem.ori.toString(),
            ],
            state: 'ACTIVE', // @TODO - backend
            team: gameStore.teamNameByColor(historyItem.team_color), // maybe @TODO - backend
            team_color: historyItem.team_color,
            warning_sent: false, //@TODO - backend
          })
          robotPoseIndex.value += 1
        }
      }
    }
  }

  function reset() {
    gameSpeed.value = 1
    loadingReportsList.value = false
    gameReportsList.value = []
    loadingReport.value = false
    gameReport.value = undefined
    gameStateIndex.value = 0
    robotPoseIndex.value = 0
  }

  // WATCH - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // whenever the computed property `activeAgentTasks` changes, update the
  // current agent tasks
  watch(
    () => activeAgentTasks.value,
    (newActiveAgentTasks, _) => {
      robotStore.agentTasks = newActiveAgentTasks
    }
  )

  // whenever the computed property `activeWorkpieces` changes, update the
  // current workpieces
  watch(
    () => activeWorkpieces.value,
    (newWorkpieces, _) => {
      orderStore.workpieces = newWorkpieces
    }
  )

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    DEFAULT_BACKEND_URL,
    loadingReportsList,
    gameReportsList,
    loadingReport,
    gameReport,
    gameSpeed,
    pointsByTeam,
    requestGameReportsList,
    requestGameReport,
    runGame,
    reset,
  }
})
