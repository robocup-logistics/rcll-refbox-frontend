import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type Robot from '@/types/Robot'
import { useConfigStore } from '@/store/configStore'
import type AgentTask from '@/types/AgentTask'
import type Color from '@/types/Color'
import type SetRobotMaintenanceOutMsg from '@/types/messages/outgoing/RobotMainenanceOutMsg'
import { useSocketStore } from '@/store/socketStore'
import { useEventStore } from '@/store/eventStore'

// ROBOT STORE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the report store maanges the robots and their corresponding agent tasks
export const useRobotStore = defineStore('robotStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const configStore = useConfigStore()
  const socketStore = useSocketStore()
  const eventStore = useEventStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const robots: Ref<Robot[]> = ref([])
  const agentTasks: Ref<AgentTask[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> config
  const MAX_NUMBER_OF_ROBOTS: ComputedRef<number> = computed(
    () =>
      <number>configStore.gameConfig.get('/llsfrb/globals/max-robots-per-team'),
  )
  const MAX_MAINTENANCE_CYCLES: ComputedRef<number> = computed(
    () =>
      <number>(
        configStore.gameConfig.get('/llsfrb/globals/maintenance-allowed-cycles')
      ),
  )
  const MAINTENANCE_DURATION: ComputedRef<number> = computed(
    () =>
      <number>(
        configStore.gameConfig.get('/llsfrb/globals/maintenance-allowed-time')
      ),
  )

  // -> name by robot
  const nameByRobot: ComputedRef<(robot: Robot) => string> = computed(() => {
    return (robot: Robot) =>
      robot.name && robot.name != '' ? robot.name : `Robot ${robot.number}`
  })

  // -> robots by color
  const robotsByColor: ComputedRef<(color: Color) => Robot[]> = computed(() => {
    return (color: Color) => {
      return robots.value.filter((robot) => robot.team_color == color)
    }
  })

  // -> robot by color and id
  const robotByColorAndId: ComputedRef<
    (color: Color, id: number) => Robot | null
  > = computed(() => {
    return (color: Color, id: number) => {
      return (
        robots.value.find(
          (robot) => robot.team_color == color && robot.number == id,
        ) || null
      )
    }
  })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> set one robot (either a new one or one with updated information)
  function setRobot(robotArg: Robot) {
    // try to find the same robot in our array of robots
    const index = robots.value.findIndex(
      (robotFi) =>
        robotFi.team_color === robotArg.team_color &&
        robotFi.number == robotArg.number,
    )

    // if we could find a robot, we replace it
    if (index !== -1) {
      // before replacing check if we should create an event
      if (robotArg.state != robots.value[index].state) {
        let msg = ''
        if (robotArg.state == 'ACTIVE') {
          msg = `${nameByRobot.value(robotArg)} has ended maintenance`
        } else if (robotArg.state == 'MAINTENANCE') {
          msg = `${nameByRobot.value(robotArg)} has entered maintenance`
        } else if (robotArg.state == 'DISQUALIFIED') {
          msg = `${nameByRobot.value(robotArg)} was disqualified`
        }
        eventStore.addEvent({
          icon: 'fa-robot',
          msg,
          team: robotArg.team_color,
        })
      }

      if (robotArg.warning_sent != robots.value[index].warning_sent) {
        let msg = ''
        if (robotArg.warning_sent == true) {
          msg = `${nameByRobot.value(robotArg)} has disconnected`
        } else if (robotArg.warning_sent == false) {
          msg = `${nameByRobot.value(robotArg)} has joined again`
        }
        eventStore.addEvent({
          icon: 'fa-robot',
          msg,
          team: robotArg.team_color,
        })
      }

      // then, update the robot
      robots.value[index] = robotArg
    }

    // if we can not find the robot, it is a new one and we add it to our array
    // only if we have not reached the maximum number of robots
    else if (
      index === -1 &&
      robotsByColor.value(robotArg.team_color).length <
        MAX_NUMBER_OF_ROBOTS.value
    ) {
      robots.value.push(robotArg)
      sortRobotsByNumber()

      // add a robot-join event
      eventStore.addEvent({
        icon: 'fa-robot',
        msg: `${nameByRobot.value(robotArg)} has joined`,
        team: robotArg.team_color,
      })
    }

    // the only remaining case is that we have received a new robot but we
    // already reached the maximum number of robots
    else {
      console.error('MAXIMUM NUMBER OF ROBOTS REACHED')
    }
  }

  // -> sort robots by number
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

  // -> set agent task
  function setAgentTask(agentTask: AgentTask) {
    // try to find an agent task that the robot that does the new agent task is
    // currently doing
    const index = agentTasks.value.findIndex(
      (taskFi) => taskFi.robot_id == agentTask.robot_id,
    )

    // check if we need to create an event
    if (robotByColorAndId.value(agentTask.team_color, agentTask.robot_id)) {
      if (
        agentTask.task_type == 'DELIVER' &&
        (index == undefined || agentTasks.value[index].task_type != 'DELIVER')
      ) {
        eventStore.addEvent({
          icon: 'fa-clipboard-check',
          msg: `${nameByRobot.value(
            robotByColorAndId.value(
              agentTask.team_color,
              agentTask.robot_id,
            ) as Robot,
          )} is delivering at ${agentTask.task_parameters.machine_id}`,
          team: agentTask.team_color,
        })
      } else if (
        agentTask.task_type == 'RETRIEVE' &&
        (index == undefined || agentTasks.value[index].task_type != 'RETRIEVE')
      ) {
        console.log(agentTask)
        eventStore.addEvent({
          icon: 'fa-clipboard-check',
          msg: `${nameByRobot.value(
            robotByColorAndId.value(
              agentTask.team_color,
              agentTask.robot_id,
            ) as Robot,
          )} is retrieving at ${agentTask.task_parameters.machine_id}`,
          team: agentTask.team_color,
        })
      }
    }

    // replace the current agent task of a robot (if it exists) with its new one
    if (index === -1) {
      agentTasks.value.push(agentTask)
    } else {
      agentTasks.value[index] = agentTask
    }
  }

  // -> send a message to the websocket to set a robot's maintenance status
  function sendSetMaintenanceStatus(robot: Robot, maintenance: boolean) {
    const msg: SetRobotMaintenanceOutMsg = {
      command: 'set_robot_maintenance',
      robot_number: robot.number,
      team_color: robot.team_color,
      maintenance: maintenance,
    }
    socketStore.sendMessage(msg)
  }

  // reset
  function reset() {
    robots.value = []
    agentTasks.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    robots,
    agentTasks,
    MAX_NUMBER_OF_ROBOTS,
    MAX_MAINTENANCE_CYCLES,
    MAINTENANCE_DURATION,
    nameByRobot,
    robotsByColor,
    robotByColorAndId,
    setRobot,
    setAgentTask,
    sendSetMaintenanceStatus,
    reset,
  }
})
