import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ComputedRef, Ref } from 'vue'
import type LogMessage from '@/types/messages/incoming/LogMessage'
import type IncomingMessage from '@/types/messages/IncomingMessage'
import type OutgoingMessage from '@/types/messages/OutgoingMessage'
import type AttentionMessage from '@/types/messages/incoming/AttentionMessage'
import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import { useOrderStore } from '@/store/orderStore'
import { useRobotStore } from '@/store/robotStore'
import { useConfigStore } from '@/store/configStore'
import { usePresetStore } from '@/store/presetStore'
import { useAppStore } from '@/store/appStore'

// SOCKET STORE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the sockets store is used to establish and manage a connection to a websocket,
// send socket messages and interact with socket messages received
export const useSocketStore = defineStore('socketStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()
  const machineStore = useMachineStore()
  const orderStore = useOrderStore()
  const robotStore = useRobotStore()
  const configStore = useConfigStore()
  const presetStore = usePresetStore()
  const appStore = useAppStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> consts
  const DEFAULT_WS_URL: Ref<string> = ref('ws://localhost:1234')

  // -> socket & connection
  const socket: Ref<WebSocket | null> = ref(null)
  const attemptingConnection: Ref<boolean> = ref(false)

  // -> log
  const logMessages: Ref<LogMessage[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> attention messages
  const attentionMessages: ComputedRef<AttentionMessage[]> = computed(
    () =>
      logMessages.value.filter(
        (msg) =>
          msg.level === 'attention' &&
          gameStore.game_time >= msg.game_time &&
          gameStore.game_time <=
            msg.game_time + parseFloat(msg.time_to_display),
      ) as AttentionMessage[],
  )

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> establish websocket connection
  function connectToWebsocket(url: string): void {
    attemptingConnection.value = true
    const newSocket = new WebSocket(url)
    setTimeout(() => {
      if (attemptingConnection.value) {
        alert('Could not connect :/ Refbox does not respond!')
      }
      attemptingConnection.value = false
    }, 10000)

    // configure behaviour on open
    newSocket.onopen = (_e) => {
      // reset info from previous connection (also sets attemtingConnection to
      // false)
      appStore.resetAll()

      // set the socket as the new socket
      socket.value = newSocket
      appStore.currentMode = 'socket'
      console.log('setting new socket')

      // configure on message
      socket.value.onmessage = (e: { data: string }) => {
        try {
          const msg: IncomingMessage = JSON.parse(e.data)

          // messages with level 'clips' contain important data that we need to
          // process further
          if (msg.level == 'clips') {
            // there are different types of 'clips' messages, each type has an
            // associated function
            switch (msg.type) {
              case 'time-info':
                gameStore.setTime(msg.content)
                return
              case 'gamestate':
                gameStore.setGamestate(msg.content)
                return
              case 'known-teams':
                gameStore.setKnownTeams(msg.content)
                return
              case 'points':
                gameStore.addReward(msg.content)
                return
              case 'order':
                orderStore.setOrder(msg.content)
                return
              case 'workpiece':
                orderStore.setWorkpiece(msg.content)
                return
              case 'robot':
                robotStore.setRobot(msg.content)
                return
              case 'agent-task':
                robotStore.setAgentTask(msg.content)
                return
              case 'machine':
                machineStore.setMachine(msg.content)
                return
              case 'ring-spec':
                machineStore.setRingSpec(msg.content)
                return
              case 'confval':
                configStore.setConfigValue(msg.content)
                return
              case 'cfg-preset':
                presetStore.setConfigPreset(msg.content)
                return
              case 'shelf-slot':
                machineStore.setShelfSlot(msg.content)
                return
              default:
                console.log('UNKNOWN MESSAGE TYPE, msg:')
                console.log(msg)
            }
          }
          // messages with a different level than 'clips' contain information we
          // just want to print out in the logs
          else {
            logMessages.value.push(msg)
          }
        } catch (err) {
          console.error(JSON.parse(e.data))
          console.error(err)
        }
      }
    }

    // configure behaviour on close
    newSocket.onclose = (e) => {
      socket.value = null
      console.log('Closing socket')
    }

    // configure on error
    newSocket.onerror = (e) => {
      alert(
        'Could not connect :/ Make sure the refbox is started and accessed via the right url!',
      )
      attemptingConnection.value = false
      console.error(e)
    }
  }

  // -> send a message via websocket
  // this method is used by other stores and not by components. If you are
  // looking to implement a new message to send to the refbox, implement a
  // method in the corresponding store that calls this method and call the new
  // method in the corresponding store from a component
  function sendMessage(msg: OutgoingMessage) {
    if (socket.value) {
      console.log('Sending ', msg)
      socket.value.send(JSON.stringify(msg))
    }
  }

  // -> close the socket connection manually
  function closeConnection() {
    if (socket.value) {
      console.log('close socket connection')
      socket.value.onclose = null
      socket.value.close()
      socket.value = null
    }
  }

  // -> reset this store
  function reset() {
    closeConnection()
    attemptingConnection.value = false
    logMessages.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    DEFAULT_WS_URL,
    socket,
    attemptingConnection,
    logMessages,
    attentionMessages,
    connectToWebsocket,
    sendMessage,
    closeConnection,
    reset,
  }
})
