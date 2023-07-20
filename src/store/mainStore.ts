import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import formatSeconds from '@/utils/formatSeconds'

import type { Ref } from 'vue'
import type WebsocketMessage from '@/types/websocketMessage'

import { useMachineStore } from '@/store/machineStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'

// main pinia store
export const useMainStore = defineStore('mainStore', () => {
  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // use other store
  const machineStore = useMachineStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()

  // team names known teams are fetched from the refbox at the beginning to be
  // able to select them when choosing a team name
  const knownTeams: Ref<string[]> = ref([])
  // name of the current cyan team
  const nameTeamCyan: Ref<string> = ref('')
  // name of the current magenta team
  const nameTeamMagenta: Ref<string> = ref('')

  // points
  const scoreCyan: Ref<number> = ref(0)
  const scoreMagenta: Ref<number> = ref(0)

  // game state
  const phase: Ref<string> = ref('PRE_GAME')
  const gametime: Ref<number> = ref(0)
  const gamestate: Ref<string> = ref('WAIT_START')
  const cyanAwardedPoints: Ref<any[]> = ref([])
  const magentaAwardedPoints: Ref<any[]> = ref([])

  // websocket attributes
  const socket: Ref<WebSocket | null> = ref(null)
  const websocketMsgs: Ref<WebsocketMessage[]> = ref([])
  const websocketURL: Ref<string> = ref('ws://localhost:1234')
  const addIpAndPort: Ref<boolean> = ref(false)

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // formatted game time
  const formattedGametime: Ref<string> = computed(() => {
    return formatSeconds(gametime.value)
  })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // establish websocket connection
  function connectToWebsocket() {
    socket.value = new WebSocket(websocketURL.value)
    console.log(socket.value)

    // configure on open
    socket.value.onopen = (e) => {
      console.log('Connection established', e)
    }

    // configure on close
    socket.value.onclose = (e) => {
      console.log(e)
      toggleAddIpAndPort()
      if (e.code === 1006) {
        alert('There is no Connection!')
      }
      socket.value = null
    }

    // configure on message
    socket.value.onmessage = (e: { data: string }) => {
      const msg: WebsocketMessage | WebsocketMessage[] = JSON.parse(e.data)
      //console.log(msg)
      // first case: received message is an array of message objects
      if (Array.isArray(msg)) {
        const msgArr = <WebsocketMessage[]>msg
        if (msgArr.length) {
          if (msgArr[0].type === 'machine-info') {
            const cyanMachines = msgArr.filter(
              (machine) => machine.team === 'CYAN'
            )
            const magentaMachines = msgArr.filter(
              (machine) => machine.team === 'MAGENTA'
            )
            machineStore.setCyanMachinesInfoAtReconnect(cyanMachines)
            machineStore.setMagentaMachinesInfoAtReconnect(magentaMachines)
          } else if (msgArr[0].type === 'robot-info') {
            const cyanRobots = msgArr.filter(
              (robot) => robot['team_color'] === 'CYAN'
            )
            const magentaRobots = msgArr.filter(
              (robot) => robot['team_color'] === 'Magenta'
            )
            robotStore.setCyanRobotsAtReconnect(cyanRobots)
            robotStore.setMagentaRobotsAtReconnect(magentaRobots)
          } else if (msgArr[0].type === 'ring-spec') {
            machineStore.setRingSpecs(msgArr)
          } else if (msgArr[0].type === 'order-info') {
            orderStore.setOrdersAtReconnect(msgArr)
          } else if (msgArr[0].type === 'points') {
            const cyanPoints = msgArr.filter((point) => point.team === 'CYAN')
            const magentaPoints = msgArr.filter(
              (point) => point.team === 'MAGENTA'
            )
            cyanAwardedPoints.value = cyanPoints
            magentaAwardedPoints.value = magentaPoints
          } else if (msgArr[0].type === 'known-teams') {
            // this array always contains a single message containing an array
            // of known teams strings (@TODO: single message instead of array
            // - needs to be done on backend)
            knownTeams.value = msgArr[0]['known_teams']
          }
        }
      }
      // other case: received message is a single message object
      else {
        const msgObj = <WebsocketMessage>msg // infos at connect
        if (msgObj.level !== 'clips') {
          websocketMsgs.value.push(msgObj)
        } else if (msgObj.type === 'gamestate') {
          setGamestateInformation(msgObj)
        } else if (msgObj.type === 'machine-info') {
          if (msgObj.team === 'CYAN') {
            machineStore.setCyanMachinesInfo(msgObj)
          } else if (msgObj.team === 'MAGENTA') {
            machineStore.setMagentaMachinesInfo(msgObj)
          }
        } else if (msgObj.type === 'robot-info') {
          robotStore.setRobotInformation(msgObj)
        } else if (msgObj.type === 'order-count') {
          orderStore.orderCount = msgObj.count
        } else if (msgObj.type === 'order-info') {
          orderStore.setOrderInfos(msgObj)
        }
      }
    }

    // configure on error
    socket.value.onerror = (e) => {
      console.error(e)
      // alert('Couldnt connect to Websocket!')
    }
  }

  // socket disconnect
  function SOCKET_DISCONNECT() {
    if (socket.value) {
      socket.value.close()
      console.log('Disconnect')
    }
  }

  // socket send
  function SOCKET_SEND(msg) {
    if (socket.value) {
      console.log('Sending ', msg)
      socket.value.send(JSON.stringify(msg))
    }
  }

  // set gamestate information
  function setGamestateInformation(payload) {
    if (gamestate.value !== payload.state) {
      gamestate.value = payload.state
    }
    if (phase.value !== payload.phase) {
      phase.value = payload.phase
    }
    if (payload.cyan !== '') {
      if (nameTeamCyan.value !== payload.cyan) {
        nameTeamCyan.value = payload.cyan
      }
    }
    if (payload.magenta !== '') {
      if (nameTeamMagenta.value !== payload.magenta) {
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
      command: 'set_gamephase',
      phase: `${newPhase}`,
    }
    SOCKET_SEND(msg)
    phase.value = newPhase
  }

  // set phase to next
  function setNextPhase() {
    if (nameTeamCyan.value || nameTeamMagenta.value) {
      if (phase.value === 'PRE_GAME') {
        setPhase('SETUP')
      } else if (phase.value === 'SETUP') {
        setPhase('EXPLORATION')
      } else if (phase.value === 'EXPLORATION') {
        setPhase('PRODUCTION')
      } else if (phase.value === 'PRODUCTION') {
        setPhase('POST_GAME')
      }
    } else {
      alert('First set team name!')
    }
  }

  // set phase to previous
  function setPreviousPhase() {
    if (phase.value === 'POST_GAME') {
      setPhase('PRODUCTION')
    } else if (phase.value === 'PRODUCTION') {
      setPhase('EXPLORATION')
    } else if (phase.value === 'EXPLORATION') {
      setPhase('SETUP')
    } else if (phase.value === 'SETUP') {
      setPhase('PRE_GAME')
    }
  }

  // set game state
  function setGameState(newGamestate) {
    const msg = {
      command: 'set_gamestate',
      state: `${newGamestate}`,
    }
    SOCKET_SEND(msg)
    gamestate.value = newGamestate
  }

  // randomize field
  function randomizeField() {
    const msg = { command: 'randomize_field' }
    SOCKET_SEND(msg)
  }

  function toggleAddIpAndPort() {
    addIpAndPort.value = !addIpAndPort.value
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    nameTeamCyan,
    nameTeamMagenta,
    knownTeams,
    scoreCyan,
    scoreMagenta,
    phase,
    gametime,
    gamestate,
    cyanAwardedPoints,
    magentaAwardedPoints,
    socket,
    websocketMsgs,
    websocketURL,
    addIpAndPort,
    formattedGametime,
    connectToWebsocket,
    SOCKET_DISCONNECT,
    SOCKET_SEND,
    setGamestateInformation,
    setPhase,
    setNextPhase,
    setPreviousPhase,
    setGameState,
    randomizeField,
    toggleAddIpAndPort,
  }
})
