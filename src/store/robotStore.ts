import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

import { useMainStore } from '@/store/mainStore'

export const useRobotStore = defineStore('robotStore', () => {

  // use other stores
  const mainStore = useMainStore()
  
  const robotsCyan: Ref<any[]> = ref([])
  const robotsMagenta: Ref<any[]> = ref([])
  const cyanRobotsFlag: Ref<boolean> = ref(false) 
  const magentaRobotsFlag: Ref<boolean> = ref(false) 

  function addCyanRobot({newRobot, index}) {
    if(index === -1) {
      robotsCyan.value.push(newRobot)
    } else {
      // replace the information of the corresponding robot object in the array with the payload coming from the websocket
      robotsCyan.value.splice(index, 1, newRobot)
    }
  }

  function addMagentaRobot({newRobot, index}) {
    if(index === -1) {
      robotsMagenta.value.push(newRobot)
    } else {
      // replace the information of the corresponding robot object in the array with the payload coming from the websocket
      robotsMagenta.value.splice(index, 1, newRobot)
    }
  }

  function setCyanRobotsAtReconnect(newRobots) {
    console.log("new cyan robots")
    console.log(newRobots)
    robotsCyan.value = newRobots
    cyanRobotsFlag.value = true
  }

  function setMagentaRobotsAtReconnect(newRobots) {
    robotsMagenta.value = newRobots
    magentaRobotsFlag.value = true
  }

  function setRobotInformation(robot) {

    if (robot['team_color'] === 'CYAN') {

      if(robotsCyan.value.length < 3) {  

        // populate and make sure that there arent any duplicates
        const index = robotsCyan.value.findIndex(robotCyan => robotCyan.name === robot.name)

        if (index === -1) {
          addCyanRobot({newRobot: robot, index})
          sortByRobotsNumber(robotsCyan.value)
        }

        if ((mainStore.phase !== 'PRE_GAME' || mainStore.phase !== 'SETUP') && index !== -1 ) {
          addCyanRobot({newRobot: robot, index})
        }

      } else {

        const index = robotsCyan.value.findIndex(robotCyan => robotCyan.name === robot.name)

        if (index !== -1) {
          addCyanRobot({newRobot: robot, index})
        }
      }

    }else {

      if(robotsMagenta.value.length < 3) {  

        // populate and make sure that there arent any duplicates
        const index = robotsMagenta.value.findIndex(robotMagenta => robotMagenta.name === robot.name)

        if (index === -1) {
          addMagentaRobot({newRobot: robot, index})
          sortByRobotsNumber(robotsMagenta.value)
        }

        if ((mainStore.phase !== 'PRE_GAME' || mainStore.phase !== 'SETUP') && index !== -1 ) {
          addMagentaRobot({newRobot: robot, index})
        }

      } else {

        const index = robotsMagenta.value.findIndex(robotMagenta => robotMagenta.name === robot.name)

        if (index !== -1) {
          addMagentaRobot({newRobot: robot, index})
        }
      } 
    }
  }

  function setCyanRobotsInfoAtReconnect(newRobots) {

    if(cyanRobotsFlag.value) {
      setCyanRobotsAtReconnect(newRobots)
      sortByRobotsNumber(robotsCyan.value)
    }
  }

  function setMagentaRobotsInfoAtReconnect(newRobots) {

    if(magentaRobotsFlag.value) {
      setMagentaRobotsAtReconnect(newRobots)
      sortByRobotsNumber(robotsMagenta.value)
    }
  }

  function setRobotMaintenanceStatus({robot, bool}) {

    const msg = {
      "command" : "set_robot_maintenance",
      "robot_number" : robot.number,
      "team_color" : robot['team_color'],
      "maintenance" : bool
    }
    mainStore.SOCKET_SEND(msg)
  }

  function sortByRobotsNumber(robots) {
    robots.sort((robot1, robot2) => {
      if (robot1.number < robot2.number) {
        return -1;
      } 
      if (robot1.number > robot2.number) {
        return 1;
      }
      // names must be equal
      return 0;
    })
  }

  return {robotsCyan, robotsMagenta, cyanRobotsFlag, magentaRobotsFlag, addCyanRobot, addMagentaRobot, setCyanRobotsAtReconnect, setMagentaRobotsAtReconnect, setRobotInformation, setCyanRobotsInfoAtReconnect, setMagentaRobotsInfoAtReconnect, setRobotMaintenanceStatus, sortByRobotsNumber}

})