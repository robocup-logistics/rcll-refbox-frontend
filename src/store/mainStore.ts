import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

import { useMachineStore } from '@/store/machineStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'

// main pinia store
export const useMainStore = defineStore('mainStore', () => {
  
  // use other store
  const machineStore = useMachineStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()

  // team names
  const nameTeamCyan: Ref<string> = ref('')
  const nameTeamMagenta: Ref<string> = ref('')

  // togglers on header
  const showFormCyan: Ref<boolean> = ref(true)
  const showFormMagenta: Ref<boolean> = ref(true)

  // points
  const scoreCyan: Ref<number> = ref(0)
  const scoreMagenta: Ref<number> = ref(0)

  // game state
  const phase: Ref<string> = ref('PRE_GAME')
  const gametime: Ref<number> = ref(0)
  const awardedPoints: Ref<any[]> = ref([])
  const cyanAwardedPoints: Ref<any[]> = ref([])
  const magentaAwardedPoints: Ref<any[]> = ref([])
  const gamestate: Ref<string> = ref('WAIT_START')

  // polling rate in components
  const pollRate: Ref<number> = ref(1500)

  // websocket attributes
  const socket: Ref = ref(null)
  const isConnected: Ref<boolean> = ref(false)
  const websocketMsgs: Ref<string[]> = ref([])
  const error: Ref<string> = ref('')
  const websocketURL: Ref<string> = ref('ws://localhost:1234')
  const pointsCyanFlag: Ref<boolean> = ref(false)
  const showPhaseSubmenus: Ref<boolean> = ref(false)
  const addIpAndPort: Ref<boolean> = ref(false)
  const knownTeams: Ref<string[]> = ref([])
  const teamMenuTriggeredCyan: Ref<boolean> = ref(false)
  const teamMenuTriggeredMagenta: Ref<boolean> = ref(false)

  // establish websocket connection
  function connectToWebsocket() {
    socket.value = new WebSocket(websocketURL.value)
    console.log(socket.value);
    SOCKET_ONOPEN()
    SOCKET_ONCLOSE()
    SOCKET_ONMESSAGE()
    SOCKET_ONERROR()
  }

  // socket disconnect
  function SOCKET_DISCONNECT() {
    socket.value.close()
    console.log('Disconnect');
  }

  // socket send
  function SOCKET_SEND(msg: {}) {
    console.log('Sending ', msg);
    socket.value.send(JSON.stringify(msg))
  }

  // socket on open
  function SOCKET_ONOPEN() {
    socket.value.onopen = (e) => {
      console.log("Connection established", e);
      isConnected.value = true;
    }
  }

  // socket on close
  function SOCKET_ONCLOSE() {
     
    socket.value.onclose = (e) => { 
      console.log(e);
      if (e.code === 1006) {
        alert('There is no Connection!')
        isConnected.value = false
        toggleAddIpAndPort()
      }
    }
  }

  // socket on message
  function SOCKET_ONMESSAGE() {

    socket.value.onmessage = (e) => { 
      let msgObj = JSON.parse(e.data);
      
      if (msgObj.length !== 0 ) {

        // messages for the logger are objects not an array such as machine 

        // infos at connect
        if(msgObj.level !== 'clips' && !(Array.isArray(msgObj))) {

          SOCKET_ADDMESSAGE(msgObj)

        } else if(msgObj.type === "gamestate") {

          setGamestateInformation(msgObj)

        } else if(msgObj.type === 'robot-info') {

          robotStore.setRobotInformation(msgObj)

        } else if(msgObj.type === 'machine-info' && msgObj.team === 'CYAN') {

          machineStore.setCyanMachinesInfo(msgObj)

        } else if(msgObj.type === 'machine-info' && msgObj.team === 'MAGENTA') {

          machineStore.setMagentaMachinesInfo(msgObj)

        } else if(msgObj.type === 'ring-spec'){

          machineStore.setRingSpecs(msgObj)

        } else if(msgObj.type === 'order-info'){

          console.log(msgObj, 'The new order!');
          orderStore.setOrderInfos(msgObj)

        } else if(msgObj.type === 'points') {

          const cyanPoints = msgObj.filter(point => point.team === 'CYAN')
          const magentaPoints = msgObj.filter(point => point.team === 'Magenta')
          cyanAwardedPoints.value = cyanPoints
          magentaAwardedPoints.value = magentaPoints

        } else if(msgObj.type === 'order-count') {

          orderStore.orderCount = msgObj.count

        }
        // websocket sends an array of objects with all of the information
        // check if that"s the case
        else if(typeof msgObj[0] !== 'undefined'){

          if (msgObj[0].type === 'machine-info') {

            const cyanMachines = msgObj.filter( machine => machine.team === 'CYAN')
            const magentaMachines = msgObj.filter( machine => machine.team === 'MAGENTA')
            machineStore.setCyanMachinesInfoAtReconnect(cyanMachines)
            machineStore.setMagentaMachinesInfoAtReconnect(magentaMachines)

          } else if(msgObj[0].type === 'robot-info') {

            const cyanRobots = msgObj.filter(robot => robot['team_color'] === "CYAN")
            const magentaRobots = msgObj.filter(robot => robot['team_color'] === "Magenta")
            robotStore.setCyanRobotsInfoAtReconnect(cyanRobots)
            robotStore.setMagentaRobotsInfoAtReconnect(magentaRobots)

          } else if(msgObj[0].type === 'ring-spec'){

            machineStore.setRingspecs(msgObj)

          } else if(msgObj[0].type === 'order-info') {

            console.log(msgObj);
            orderStore.setOrdersAtReconnect(msgObj)

          } else if(msgObj[0].type === 'points') {

            const cyanPoints = msgObj.filter(point => point.team === 'CYAN')
            const magentaPoints = msgObj.filter(point => point.team === 'MAGENTA')
            cyanAwardedPoints.value = cyanPoints
            magentaAwardedPoints.value = magentaPoints

          } else if(msgObj[0].type === 'known-teams') {

            knownTeams.value = msgObj[0]["known_teams"]

          }  
        } 
      }          
    }
  }

  // socket on error
  function SOCKET_ONERROR() {
    socket.value.onerror = (e) => { 
      console.log(e);
      // alert('Couldnt connect to Websocket!')
      console.log("ON ERROR!");
    }
  }

  // socket add message
  function SOCKET_ADDMESSAGE(msg){
    websocketMsgs.value.push(msg)
    // scroll to bottom of log?
  }

  // set gamestate information
  function setGamestateInformation(payload) {

    if (gamestate.value !== payload.state) {

      setGameState(payload.state)

    }
    if (phase.value !== payload.phase) {

      setPhase(payload.phase)

    }
    if (payload.cyan !== "") {
      if (nameTeamCyan.value !== payload.cyan) {

        toggleShowFormCyan()
        nameTeamCyan.value = payload.cyan

      }
    }
    if (payload.magenta !== "" ) {
      if (nameTeamMagenta.value !== payload.magenta) {

        toggleShowFormMagenta()
        nameTeamMagenta.value = payload.magenta
    
      }
    }
    if (scoreCyan.value !== payload['points_cyan']) {

      scoreCyan.value = payload['points_cyan']
    
    }
    if (scoreMagenta.value !== payload['points_magenta']) {

      scoreMagenta.value = payload['points_magenta']

    }

    gametime.value = parseInt(payload['game_time'])
  }

  // set phase by name
  function setPhase(newPhase: string) {
    const msg = {
      "command" : "set_gamephase",
      "phase" : `${newPhase}`
    }
    SOCKET_SEND(msg)
    phase.value = newPhase;
  }

  // set phase to next
  function setNextPhase() {

    if(nameTeamCyan.value || nameTeamMagenta.value){

      if (phase.value === 'PRE_GAME') {

        setPhase('SETUP')

      } else if(phase.value === 'SETUP') {

        setPhase('EXPLORATION')

      } else if(phase.value === 'EXPLORATION') {

        setPhase('PRODUCTION')

      } else if(phase.value === 'PRODUCTION') {

        setPhase('POST_GAME')

      }

    }else {

      alert('First set team name!');

    }
  }

  // set phase to previous
  function setPreviousPhase() {

    if (phase.value === 'POST_GAME') {
      
      setPhase('PRODUCTION')

    } else if(phase.value === 'PRODUCTION') {
      
      setPhase('EXPLORATION')

    } else if(phase.value === 'EXPLORATION') {
      
      setPhase('SETUP')

    } else if(phase.value === 'SETUP') {
     
      setPhase('PRE_GAME')
    }
  }

  // set game state
  function setGameState(newGamestate) {

    const msg = {
      "command" : "set_gamestate",
      "state" : `${newGamestate}`
    }
    SOCKET_SEND(msg)
    gamestate.value = newGamestate
  }

  // send add points team
  function sendAddPointsTeam(msg) {
    SOCKET_SEND(msg)
  }

  // randomize field
  function randomizeField() {
    const msg = { "command" : "randomize_field"}
    SOCKET_SEND(msg)
  }

  function togglePhaseSubmenus() {
    showPhaseSubmenus.value = !showPhaseSubmenus.value
  }
  function closePhaseSubmenus() {
    showPhaseSubmenus.value = false
  }
  function toggleTeamMenuCyan() {
    teamMenuTriggeredCyan.value = !teamMenuTriggeredCyan.value
  }
  function closeTeamMenuCyan() {
    teamMenuTriggeredCyan.value = false
  }
  function openTeamMenuCyan() {
    teamMenuTriggeredCyan.value = true
  }
  function toggleTeamMenuMagenta() {
    teamMenuTriggeredMagenta.value = !teamMenuTriggeredMagenta.value
  }
  function closeTeamMenuMagenta() {
    teamMenuTriggeredMagenta.value = false
  }
  function openTeamMenuMagenta() {
    teamMenuTriggeredMagenta.value = true
  }
  function toggleAddIpAndPort() {
    addIpAndPort.value = !addIpAndPort.value
  }
  function toggleShowFormCyan() {
    showFormCyan.value = !showFormCyan.value
  }
  function toggleShowFormMagenta() {
    showFormMagenta.value = !showFormMagenta.value
  }

  return {nameTeamCyan, nameTeamMagenta, showFormCyan, showFormMagenta, scoreCyan, scoreMagenta, phase, gametime, awardedPoints, cyanAwardedPoints, magentaAwardedPoints, gamestate, pollRate, socket, isConnected, websocketMsgs, error, websocketURL, pointsCyanFlag, showPhaseSubmenus, addIpAndPort, knownTeams, teamMenuTriggeredCyan, teamMenuTriggeredMagenta, connectToWebsocket, SOCKET_DISCONNECT, SOCKET_SEND, SOCKET_ONOPEN, SOCKET_ONCLOSE, SOCKET_ONMESSAGE, SOCKET_ONERROR, SOCKET_ADDMESSAGE, setGamestateInformation, setPhase, setNextPhase, setPreviousPhase, setGameState, sendAddPointsTeam, randomizeField, togglePhaseSubmenus, closePhaseSubmenus, toggleTeamMenuCyan, closeTeamMenuCyan, openTeamMenuCyan, toggleTeamMenuMagenta, closeTeamMenuMagenta, openTeamMenuMagenta, toggleAddIpAndPort, toggleShowFormCyan, toggleShowFormMagenta}
})
