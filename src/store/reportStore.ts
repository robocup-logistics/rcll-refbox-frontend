import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ComputedRef, Ref } from 'vue'

import { useSocketStore } from '@/store/socketStore'
import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'
import { useViewStore } from '@/store/viewStore'
import type GameReport from '@/types/GameReport'
import RingSpec from '@/types/Ringspec'

// main pinia store
export const useReportStore = defineStore('reportStore', () => {
  // use other stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const socketStore = useSocketStore()
  const gameStore = useGameStore()
  const machineStore = useMachineStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()
  const viewStore = useViewStore()

  // CONSTS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const DEFAULT_BACKEND_URL: Ref<string> = ref('http://localhost:8083')

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const loadingReportsList: Ref<boolean> = ref(false)
  const gameReportsList: Ref<GameReport[]> = ref([])
  const loadingReport: Ref<boolean> = ref(false)
  const gameReport: Ref<GameReport | null> = ref(null)
  const gameSpeed: Ref<number> = ref(1)

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async function requestGameReportsList(baseUrl: string) {
    loadingReportsList.value = true
    gameReportsList.value = []
    let response
    try {
      response = await fetch(`${baseUrl}/api/getReportsList`)
      gameReportsList.value = <GameReport[]>await response.json()
    } catch (err) {
      console.error(err)
      if (response && !response.ok) {
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
      reset()
      socketStore.reset()
      gameStore.reset()
      machineStore.reset()
      orderStore.reset()
      robotStore.reset()
      viewStore.reset()
      // select the new game report
      gameReport.value = newGameReport
      // set gamestate information
      gameStore.setGamestateInformation({
        cyan: newGameReport.teams[0],
        field_height: newGameReport['gamestate/SETUP']['field-height'],
        field_mirrored: newGameReport['gamestate/SETUP']['field-mirrored'],
        field_width: newGameReport['gamestate/SETUP']['field-width'],
        game_time: 0,
        magenta: newGameReport.teams[1],
        over_time: false,
        phase: 'PRE_GAME',
        points_cyan: '0',
        points_magenta: '0',
        state: 'WAIT_START',
      })
      // set orders
      for (const order of newGameReport.orders) {
        orderStore.setOrder({
          active_by: '@TODO',
          base_color: order['base-color'],
          cap_color: order['cap-color'],
          competitive: true, // @TODO currently in uppercase strings in MongoDB, wait for answer on issue
          complexity: order['complexity'],
          delivery_gate: order['delivery-gate'],
          delivery_period: [
            order['delivery-period'][0].toString(),
            order['delivery-period'][1].toString(),
          ],
          id: order['id'],
          quantity_delivered: ['0', '0'],
          quantity_requested: order['quantity-requested'],
          ring_colors: order['ring-colors'],
          unconfirmed_deliveries: [],
        })
      }
      // set machines
      for (const machine of newGameReport['machines']) {
        const machineMeta = newGameReport['machine-meta'].find(
          (machineFi) => machineFi['name'] == machine['name']
        )
        machineStore.addMachine({
          actual_lights: [], //@TODO missing in game report?
          mtype: machine['mtype'],
          name: machine['name'],
          rotation: machine['rotation'],
          state: machine['state'],
          team: machine['team'],
          zone: machine['zone'],
          bs_color: machineMeta['bs-color'],
          bs_side: machineMeta['bs-side'],
          cs_cap_color: machineMeta['cs-cap-color'],
          cs_operation: machineMeta['cs-operation'],
          cs_retrieved: machineMeta['cs-retrieved'],
          ds_gate: machineMeta['ds-gate'],
          ds_order: machineMeta['ds-order-id'],
          bases_added: machineMeta['bases-added'],
          bases_used: machineMeta['bases-used'],
          rs_ring_color: machineMeta['rs-ring-color'],
          rs_ring_colors: machineMeta['rs-ring-colors'],
        })
      }
      // set ring specs
      const newRingSpecs: RingSpec[] = []
      for (const ringSpec of newGameReport['ring-specs']) {
        newRingSpecs.push({
          color: ringSpec['color'],
          req_bases: ringSpec['req-bases'],
        })
      }
      machineStore.setRingSpecs(newRingSpecs)
    }
  }

  function runGame() {
    gameStore.gamestate = 'RUNNING'
    gameStep()
  }

  function gameStep() {
    setTimeout(() => {
      gameStore.gametime += 1
      if (gameStore.gamestate == 'RUNNING') {
        gameStep()
      }
    }, 1000 / gameSpeed.value)
  }

  function reset() {
    gameReport.value = null
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    DEFAULT_BACKEND_URL,
    loadingReportsList,
    gameReportsList,
    loadingReport,
    gameReport,
    gameSpeed,
    requestGameReportsList,
    requestGameReport,
    runGame,
    reset,
  }
})
