import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { ComputedRef, Ref } from 'vue'
import type WebsocketMessage from '@/types/WebsocketMessage'
import type InfoMessage from '@/types/InfoMessage'
import type AwardedPoints from '@/types/AwardedPoints'
import type Machine from '@/types/Machine'
import type OrderCount from '@/types/OrderCount'
import type Order from '@/types/Order'
import type RingSpec from '@/types/Ringspec'
import type Robot from '@/types/Robot'
import type Gamestate from '@/types/Gamestate'
import type OutgoingMessage from '@/types/messages/OutgoingMessage'
import type SetGamephaseOutMsg from '@/types/messages/SetGamephaseOutMsg'
import type SetGamestateOutMsg from '@/types/messages/SetGamestateOutMsg'
import type RandomizeFieldOutMsg from '@/types/messages/RandomizeFieldOutMsg'
import type SetRobotMaintenanceOutMsg from '@/types/messages/RobotMainenanceOutMsg'
import type Phase from '@/types/Phase'
import type State from '@/types/State'

import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'
import { useReportStore } from '@/store/reportStore'
import { useViewStore } from '@/store/viewStore'

// main pinia store
export const useSocketStore = defineStore('socketStore', () => {
  // use other stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const reportStore = useReportStore()
  const gameStore = useGameStore()
  const machineStore = useMachineStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()
  const viewStore = useViewStore()

  // CONSTS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const DEFAULT_WS_URL: Ref<string> = ref('ws://localhost:1234')

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const socket: Ref<WebSocket | null> = ref(null)
  const attemptingConnection: Ref<boolean> = ref(false)
  const infoMessages: Ref<InfoMessage[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const attentionMessages: ComputedRef<InfoMessage[]> = computed(() =>
    infoMessages.value.filter((msg) => msg.level === 'attention')
  )

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // establish websocket connection
  function connectToWebsocket(url: string) {
    attemptingConnection.value = true
    const newSocket = new WebSocket(url)
    setTimeout(() => {
      if (attemptingConnection.value) {
        alert('Could not connect :/ Refbox does not respond!')
      }
      attemptingConnection.value = false
    }, 10000)

    // configure behaviour on open
    newSocket.onopen = (e) => {
      // reset info from previous connection (also sets attemtingConnection to
      // false)
      reset()
      reportStore.reset()
      gameStore.reset()
      machineStore.reset()
      orderStore.reset()
      robotStore.reset()
      viewStore.reset()

      // set the socket as the new socket
      socket.value = newSocket

      // configure on message
      socket.value.onmessage = (e: { data: string }) => {
        const msg: WebsocketMessage | WebsocketMessage[] = JSON.parse(e.data)
        // first case: received message is an array of message objects
        if (Array.isArray(msg)) {
          const msgArr = <WebsocketMessage[]>msg
          if (msgArr.length) {
            if (msgArr[0].type === 'machine-info') {
              machineStore.setMachineInfosAtReconnect(msgArr as Machine[])
            } else if (msgArr[0].type === 'robot-info') {
              robotStore.setRobotsAtReconnect(msgArr as Robot[])
            } else if (msgArr[0].type === 'ring-spec') {
              machineStore.setRingSpecs(msgArr as RingSpec[])
            } else if (msgArr[0].type === 'order-info') {
              orderStore.setOrders(msgArr as Order[])
            } else if (msgArr[0].type === 'points') {
              gameStore.awardedPoints = msgArr as AwardedPoints[]
            } else if (msgArr[0].type === 'known-teams') {
              // this array always contains a single message containing an array
              // of known teams strings (@TODO: single message instead of array
              // - needs to be done on backend)
              gameStore.knownTeams = msgArr[0][
                'known_teams'
              ]?.sort() as string[]
            }
          }
        }
        // other case: received message is a single message object
        else {
          const msgObj = <WebsocketMessage>msg

          // if the level of the message object is not 'clips' it is a message
          // that is meant to be displayed (to the referee), so add it is
          if (msgObj.level !== 'clips') {
            infoMessages.value.push(msgObj as InfoMessage)
          }
          // else process the messages as usual
          else if (msgObj.type === 'gamestate') {
            gameStore.setGamestateInformation(msgObj as Gamestate)
          } else if (msgObj.type === 'machine-info') {
            machineStore.setMachineInfo(msgObj as Machine)
          } else if (msgObj.type === 'robot-info') {
            robotStore.setRobotInformation(msgObj as Robot)
          } else if (msgObj.type === 'order-count') {
            orderStore.orderCount = (msgObj as OrderCount).count
          } else if (msgObj.type === 'order-info') {
            orderStore.setOrder(msgObj as Order)
          }
        }
      }
    }

    // configure behaviour on close
    newSocket.onclose = (e) => {
      socket.value = null
    }

    // configure on error
    newSocket.onerror = (e) => {
      alert(
        'Could not connect :/ Make sure the refbox is started and accessed via the right url!'
      )
      attemptingConnection.value = false
      console.error(e)
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
  function SOCKET_SEND(msg: OutgoingMessage) {
    if (socket.value) {
      console.log('Sending ', msg)
      socket.value.send(JSON.stringify(msg))
    }
  }

  // set phase by name
  function setPhase(newPhase: Phase) {
    const msg: SetGamephaseOutMsg = {
      command: 'set_gamephase',
      phase: `${newPhase}`,
    }
    SOCKET_SEND(msg)
    gameStore.phase = newPhase
  }

  // set game state
  function setGameState(newGamestate: State) {
    const msg: SetGamestateOutMsg = {
      command: 'set_gamestate',
      state: `${newGamestate}`,
    }
    SOCKET_SEND(msg)
    gameStore.gamestate = newGamestate
  }

  // randomize field
  function randomizeField() {
    const msg: RandomizeFieldOutMsg = { command: 'randomize_field' }
    SOCKET_SEND(msg)
  }

  function setRobotMaintenanceStatus(robot: Robot, maintenance: boolean) {
    const msg: SetRobotMaintenanceOutMsg = {
      command: 'set_robot_maintenance',
      robot_number: robot.number,
      team_color: robot['team_color'],
      maintenance: maintenance,
    }
    SOCKET_SEND(msg)
  }

  function reset() {
    // do not subscribe to messages of the previous socket anymore
    if (socket.value) {
      socket.value.onopen = null
      socket.value.onmessage = null
      socket.value.onclose = null
      socket.value.onerror = null
    }
    socket.value = null
    attemptingConnection.value = false
    infoMessages.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    DEFAULT_WS_URL,
    socket,
    attemptingConnection,
    infoMessages,
    attentionMessages,
    connectToWebsocket,
    SOCKET_DISCONNECT,
    SOCKET_SEND,
    setPhase,
    setGameState,
    randomizeField,
    setRobotMaintenanceStatus,
  }
})
