import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { defineStore } from 'pinia'
import type Robot from '@/types/Robot'
import { useMachineStore } from '@/store/machineStore'
import { useConfigStore } from '@/store/configStore'
import type RandomizeFieldOutMsg from '@/types/messages/outgoing/RandomizeFieldOutMsg'
import { useSocketStore } from '@/store/socketStore'
import type MachinePose from '@/types/MachinePose'
import SetMachinePoseOutMsg from '@/types/messages/outgoing/SetMachinePoseOutMsg'

// FIELD STORE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the field store provides information about and interaction with the playing
// field and its contents
export const useFieldStore = defineStore('fieldStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const machineStore = useMachineStore()
  const configStore = useConfigStore()
  const socketStore = useSocketStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> width and height of the field and its wrapper in pixels
  // updated by event listeners in a component
  const fieldWrapperWidthPixels: Ref<number> = ref(0)
  const fieldWrapperHeightPixels: Ref<number> = ref(0)
  const fieldWidthPixels: Ref<number> = ref(0)
  const fieldHeightPixels: Ref<number> = ref(0)

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> config
  const horizontalFieldSize: ComputedRef<number> = computed(
    () => <number>configStore.gameConfig.get('/llsfrb/game/field/width'),
  )
  const isFieldMirrored: ComputedRef<boolean> = computed(
    () => <boolean>configStore.gameConfig.get('/llsfrb/game/field/mirrored'),
  )
  const verticalFieldSize: ComputedRef<number> = computed(
    () => <number>configStore.gameConfig.get('/llsfrb/game/field/height'),
  )

  // -> full horizontal field size (in number of squares)
  const fullHorizontalFieldSize: ComputedRef<number> = computed(
    () => horizontalFieldSize.value * 2,
  )

  // -> number of pixels of the horiontal or vertical diameter of a square
  const squareDiameterPixels: ComputedRef<number> = computed(
    () => fieldHeightPixels.value / verticalFieldSize.value,
  )

  // -> position of a waypoint (either field or machine)
  const positionOfWaypoint: ComputedRef<(el: String) => [number, number]> =
    computed(() => {
      return (el: String) => {
        // first check if the waypoint is a zone or a machine. We try to find a
        // machine with the name of the waypoint - if we cannot find one, we assume the waypoint is
        // a zone
        const machine = machineStore.machines.find(
          (machine) => machine.name == el,
        )
        let zone
        if (machine) {
          zone = machine.zone
        } else {
          zone = el
        }
        const zoneArr = Array.from(zone)
        const pos = [
          squareDiameterPixels.value / 2,
          fieldHeightPixels.value -
            squareDiameterPixels.value / 2 -
            (parseInt(zoneArr[4]) - 1) * squareDiameterPixels.value,
        ]
        pos[0] += fieldWidthPixels.value / 2
        if (zoneArr[0] == 'M') {
          pos[0] -= parseInt(zoneArr[3]) * squareDiameterPixels.value
        } else if (zoneArr[0] == 'C') {
          pos[0] += (parseInt(zoneArr[3]) - 1) * squareDiameterPixels.value
        } else {
          throw new Error('incorrect zone string - parsing error')
        }
        return <[number, number]>pos
      }
    })

  // -> position of a robot
  const positionOfRobot: ComputedRef<(robot: Robot) => [number, number]> =
    computed(() => {
      return (robot: Robot) => {
        return [
          fieldWidthPixels.value / 2 +
            robot.pose[0] * squareDiameterPixels.value,
          fieldHeightPixels.value - robot.pose[1] * squareDiameterPixels.value,
        ]
      }
    })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> send a message to the refbox to randomize the field
  function sendRandomizeField() {
    const msg: RandomizeFieldOutMsg = { command: 'randomize_field' }
    socketStore.sendMessage(msg)
  }

  // -> send a message to the websocket to set a config value
  function sendSetMachinePose(start_zone: string, target_zone: string) {
    const machine = machineStore.machines.find(
      (machine) => machine.zone === start_zone,
    )
    if (machine) {
      if (start_zone === target_zone) {
        const msg: SetMachinePoseOutMsg = {
          command: 'set_machine_pose',
          name: machine.name,
          rotation: (machine.rotation + 45) % 360,
          zone: target_zone,
        }
        socketStore.sendMessage(msg)
      } else {
        const msg: SetMachinePoseOutMsg = {
          command: 'set_machine_pose',
          name: machine.name,
          rotation: machine.rotation,
          zone: target_zone,
        }
        socketStore.sendMessage(msg)
      }
    }
  }

  // -> reset
  function reset() {
    // no need to change fieldWrapperWidthPixels, fieldWrapperHeightPixels,
    // fieldWidthPixels and fieldHeightPixels values because they are
    // automatically recomputed via event listeners
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    fieldWrapperWidthPixels,
    fieldWrapperHeightPixels,
    fieldWidthPixels,
    fieldHeightPixels,
    horizontalFieldSize,
    isFieldMirrored,
    verticalFieldSize,
    fullHorizontalFieldSize,
    squareDiameterPixels,
    positionOfWaypoint,
    positionOfRobot,
    sendRandomizeField,
    sendSetMachinePose,
    reset,
  }
})
