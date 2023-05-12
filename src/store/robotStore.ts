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

  function setCyanRobots({payload, index}) {
    if(index === -1) {
      robotsCyan.value.push(payload)
    } else {
      // replace the information of the corresponding robot object in the array with the payload coming from the websocket
      robotsCyan.value.splice(index, 1, payload)
    }
  }

  function setMagentaRobots({payload, index}) {
    if(index === -1) {
      robotsMagenta.value.push(payload)
    } else {
      // replace the information of the corresponding robot object in the array with the payload coming from the websocket
      robotsMagenta.value.splice(index, 1, payload)
    }
  }

  function setCyanRobotsAtReconnect(payload) {
    robotsCyan.value = payload
    cyanRobotsFlag.value = true
  }

  function setMagentaRobotsAtReconnect(payload) {
    robotsMagenta.value = payload
    magentaRobotsFlag.value = true
  }

  function setRobotInformation(payload) {

    if (payload['team_color'] === 'CYAN') {

      if(robotsCyan.value.length < 3) {  

        // populate and make sure that there arent any duplicates
        const index = robotsCyan.value.findIndex(robot => robot.name === payload.name)

        if (index === -1) {
          setCyanRobots({payload, index})
          sortByRobotsNumber(robotsCyan.value)
        }

        if ((mainStore.phase !== 'PRE_GAME' || mainStore.phase !== 'SETUP') && index !== -1 ) {
          setCyanRobots({payload, index})
        }

      } else {

        const index = robotsCyan.value.findIndex(robot => robot.name === payload.name)

        if (index !== -1) {
          setCyanRobots({payload, index})
        }
      }

    }else {

      if(robotsMagenta.value.length < 3) {  

        // populate and make sure that there arent any duplicates
        const index = robotsMagenta.value.findIndex(robot => robot.name === payload.name)

        if (index === -1) {
          setMagentaRobots({payload, index})
          sortByRobotsNumber(robotsMagenta.value)
        }

        if ((mainStore.phase !== 'PRE_GAME' || mainStore.phase !== 'SETUP') && index !== -1 ) {
          setMagentaRobots({payload, index})
        }

      } else {

        const index = robotsMagenta.value.findIndex(robot => robot.name === payload.name)

        if (index !== -1) {
          setMagentaRobots({payload, index})
        }
      } 
    }
  }

  function setCyanRobotsInfoAtReconnect(payload) {

    if(cyanRobotsFlag.value) {
      setCyanRobotsAtReconnect(payload)
      sortByRobotsNumber(robotsCyan.value)
    }
  }

  function setMagentaRobotsInfoAtReconnect(payload) {

    if(magentaRobotsFlag.value) {
      setMagentaRobotsAtReconnect(payload)
      sortByRobotsNumber(robotsMagenta.value)
    }
  }

  function setRobotMaintenanceStatus(payload) {

    const msg = {
      "command" : "set_robot_maintenance",
      "robot_number" : payload.robot.number,
      "team_color" : payload.robot['team_color'],
      "maintenance" : payload.bool
    }
    mainStore.SOCKET_SEND(msg)
  }

  function sortByRobotsNumber(payload) {
    payload.sort((robot1, robot2) => {
      let number1 = robot1.number;
      let number2 = robot2.number;
      if (number1 < number2) {
        return -1;
      } 
      if (number1 > number2) {
        return 1;
      }
      // names must be equal
      return 0;
    })
  }

  return {robotsCyan, robotsMagenta, cyanRobotsFlag, magentaRobotsFlag, setCyanRobots, setMagentaRobots, setCyanRobotsAtReconnect, setMagentaRobotsAtReconnect, setRobotInformation, setCyanRobotsInfoAtReconnect, setMagentaRobotsInfoAtReconnect, setRobotMaintenanceStatus, sortByRobotsNumber}

})