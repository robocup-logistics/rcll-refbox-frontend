import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type Robot from '@/types/Robot'
import { useMachineStore } from '@/store/machineStore'

export const useViewStore = defineStore('viewStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const machineStore = useMachineStore()
  const { machines } = storeToRefs(machineStore)

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // while there is no authentication required to send messages to the refbox
  // (such as giving points), we need some method such as a hidden keyboard
  // shortcut to prevent users from going into referee mode and doing such
  // things. As soon as this keyboard shortcut is pressed, all options are
  // unlocked and the user can switch to the referee mode.
  const adminActivated: Ref<boolean> = ref(false)

  // whether the referee view is active (only works with admin activated)
  const refereeView: Ref<boolean> = ref(false)

  // popup counter: current z-index for newly opened popups (gets higher with
  // each popup toggle). Used because newly opened popups should be displayed
  // above previously opened
  const popupCounter: Ref<number> = ref(10)

  // size of the playing field
  const horizontalFieldSize: Ref<number> = ref(7)
  const verticalFieldSize: Ref<number> = ref(8)
  const isFieldMirrored: Ref<boolean> = ref(true)

  // width and height of the field and its wrapper in pixels (updated by the UI)
  const fieldWrapperWidthPixels: Ref<number> = ref(0)
  const fieldWrapperHeightPixels: Ref<number> = ref(0)
  const fieldWidthPixels: Ref<number> = ref(0)
  const fieldHeightPixels: Ref<number> = ref(0)

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const fullHorizontalFieldSize: ComputedRef<number> = computed(() =>
    isFieldMirrored.value
      ? horizontalFieldSize.value * 2
      : horizontalFieldSize.value
  )
  const squareDiameterPixels: ComputedRef<number> = computed(
    () => fieldHeightPixels.value / verticalFieldSize.value
  )

  const positionOfWaypoint: ComputedRef<(el: String) => [number, number]> =
    computed(() => {
      return (el: String) => {
        // first check if the waypoint is a zone or a machine. We try to find a
        // machine with the name of the waypoint - if we cannot find one, we assume the waypoint is
        // a zone
        const machine = machines.value.find((machine) => machine.name == el)
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
        if (isFieldMirrored.value) {
          pos[0] += fieldWidthPixels.value / 2
        }
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

  const positionOfRobot: ComputedRef<(robot: Robot) => [number, number]> =
    computed(() => {
      return (robot: Robot) => {
        return [
          fieldWidthPixels.value / 2 +
            parseFloat(robot.pose[0]) * squareDiameterPixels.value,
          fieldHeightPixels.value -
            parseFloat(robot.pose[1]) * squareDiameterPixels.value,
        ]
      }
    })

  // FUNCTIONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function reset() {
    // do not change adminActivated and Referee view values because we want to
    // preserve the current view and options when we call reset
    popupCounter.value = 10
    horizontalFieldSize.value = 7
    verticalFieldSize.value = 8
    isFieldMirrored.value = true
    // do not change fieldWrapperWidthPixels, fieldWrapperHeightPixels,
    // fieldWidthPixels and fieldHeightPixels values because they are
    // automatically recomputed via event listeners
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    adminActivated,
    refereeView,
    popupCounter,
    isFieldMirrored,
    horizontalFieldSize,
    verticalFieldSize,
    fullHorizontalFieldSize,
    fieldWrapperWidthPixels,
    fieldWrapperHeightPixels,
    fieldWidthPixels,
    fieldHeightPixels,
    squareDiameterPixels,
    positionOfWaypoint,
    positionOfRobot,
    reset,
  }
})
