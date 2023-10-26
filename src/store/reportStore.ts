import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ComputedRef, Ref } from 'vue'

import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'
import type GameReport from '@/types/GameReport'

// main pinia store
export const useReportStore = defineStore('reportStore', () => {
  // use other stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()
  const machineStore = useMachineStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()

  // CONSTS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const DEFAULT_BACKEND_URL: Ref<string> = ref('http://localhost:8083')

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const loadingReportsList: Ref<boolean> = ref(false)
  const gameReportsList: Ref<GameReport[]> = ref([])
  const loadingReport: Ref<boolean> = ref(false)
  const gameReport: Ref<GameReport | null> = ref(null)

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
    let response
    try {
      response = await fetch(
        `${baseUrl}/api/getReportById?` +
          new URLSearchParams({
            reportId,
          })
      )
      gameReport.value = <any>await response.json()
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
    if (gameReport.value) {
      gameStore.setGamestateInformation({
        cyan: gameReport.value.teams[0], // name of the cyan team, e.g. 'Carologistics'
        game_time: 0, // game time in seconds (including miliseconds after the comma)
        level: 'clips',
        magenta: gameReport.value.teams[1], // name of the magenta team
        over_time: false, // e.g. false
        phase: 'PRE_GAME', // e.g. 'POST_GAME'
        points_cyan: '0', // e.g. '129'
        points_magenta: '0', // e.g. '0'
        prev_phase: 'PRE_GAME', // e.g. 'POST_GAME'
        state: 'WAIT_START', // e.g. 'PAUSED'
        type: 'gamestate',
      })
    }
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
    requestGameReportsList,
    requestGameReport,
    reset,
  }
})
