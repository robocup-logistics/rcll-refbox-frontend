import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type Robot from '@/types/Robot'

import { useGameStore } from '@/store/gameStore'

export const useRobotStore = defineStore('robotStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()

  // CONSTANTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const MAX_MAINTENANCE_CYCLES = 2

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const robots: Ref<Robot[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // robots by color
  const robotsByColor: ComputedRef<(color: string) => Robot[]> = computed(
    () => {
      return (color: string) => {
        return robots.value.filter((robot) => robot.team_color == color)
      }
    }
  )

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function addRobot(robotArg: Robot, index: number) {
    if (index === -1) {
      robots.value.push(robotArg)
    } else {
      robots.value.splice(index, 1, robotArg)
    }
  }

  function setRobotsAtReconnect(newRobots: Robot[]) {
    robots.value = newRobots
    sortRobotsByNumber()
  }

  function setRobotInformation(robotArg: Robot) {
    if (robotsByColor.value(robotArg['team_color']).length < 3) {
      // populate and make sure that there arent any duplicates
      const index = robots.value.findIndex(
        (robotFi) => robotFi.name === robotArg.name
      )

      if (index === -1) {
        addRobot(robotArg, index)
        sortRobotsByNumber()
      } else if (gameStore.phase !== 'PRE_GAME') {
        addRobot(robotArg, index)
      }
    } else {
      const index = robots.value.findIndex(
        (robotFi) => robotFi.name === robotArg.name
      )

      if (index !== -1) {
        addRobot(robotArg, index)
      }
    }
  }

  function sortRobotsByNumber() {
    robots.value.sort((robot1, robot2) => {
      if (robot1.number < robot2.number) {
        return -1
      }
      if (robot1.number > robot2.number) {
        return 1
      }
      return 0
    })
  }

  function reset() {
    robots.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    MAX_MAINTENANCE_CYCLES,
    robots,
    robotsByColor,
    setRobotsAtReconnect,
    setRobotInformation,
    reset,
  }
})
