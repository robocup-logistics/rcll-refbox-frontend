import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import Robot from '@/types/Robot'
import { useRuleStore } from '@/store/ruleStore'
import type AgentTask from '@/types/AgentTask'
import type Color from '@/types/Color'

export const useRobotStore = defineStore('robotStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const ruleStore = useRuleStore()
  const { MAX_NUMBER_OF_ROBOTS } = storeToRefs(ruleStore)

  // CONSTANTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const MAX_MAINTENANCE_CYCLES = 2

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const robots: Ref<Robot[]> = ref([])
  const agentTasks: Ref<AgentTask[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // robots by color
  const robotsByColor: ComputedRef<(color: Color) => Robot[]> = computed(() => {
    return (color: Color) => {
      return robots.value.filter((robot) => robot.team_color == color)
    }
  })

  // robot by color and id
  const robotByColorAndId: ComputedRef<
    (color: Color, id: number) => Robot | null
  > = computed(() => {
    return (color: Color, id: number) => {
      return (
        robots.value.find(
          (robot) => robot.team_color == color && robot.number == id
        ) || null
      )
    }
  })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // sets all robots at reconnect
  function setRobotsAtReconnect(newRobots: Robot[]) {
    robots.value = newRobots
    sortRobotsByNumber()
  }

  // sets a single robot (either a new one or one with updated information)
  function setRobot(robotArg: Robot) {
    // try to find the same robot in our array of robots
    const index = robots.value.findIndex(
      (robotFi) =>
        robotFi.team_color === robotArg.team_color &&
        robotFi.number == robotArg.number
    )

    // if we could find a robot, we just replace it
    if (index !== -1) {
      robots.value.splice(index, 1, robotArg)
    }

    // if we can not find the robot, it is a new one and we add it to our array
    // only if we have not reached the maximum number of robots
    else if (
      index === -1 &&
      robotsByColor.value(robotArg['team_color']).length <
        MAX_NUMBER_OF_ROBOTS.value
    ) {
      robots.value.push(robotArg)
      sortRobotsByNumber()
    }

    // the only remaining case is that we have received a new robot but we
    // already reached the maximum number of robots
    else {
      console.error('MAXIMUM NUMBER OF ROBOTS REACHED')
    }
  }

  // sort robots by number
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

  // set agent task
  // @TODO - either remove tasks with an end or replace tasks with same robot
  function setAgentTask(agentTask: AgentTask) {
    const index = agentTasks.value.indexOf(agentTask)
    if (index === -1) {
      agentTasks.value.push(agentTask)
    } else {
      agentTasks.value[index] = agentTask
    }
  }

  // reset
  function reset() {
    robots.value = []
    agentTasks.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    MAX_MAINTENANCE_CYCLES,
    robots,
    agentTasks,
    robotsByColor,
    robotByColorAndId,
    setRobotsAtReconnect,
    setRobot,
    setAgentTask,
    reset,
  }
})
