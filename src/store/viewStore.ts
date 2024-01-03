import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { defineStore } from 'pinia'
import type Robot from '@/types/Robot'

export const useViewStore = defineStore('viewStore', () => {
  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const refereeView: Ref<boolean> = ref(false)

  // popup counter: current z-index for newly opened popups (gets higher with
  // each popup toggle). Used because newly opened popups should be displayed
  // above previously opened
  const popupCounter: Ref<number> = ref(10)

  // size of the playing field
  const horizontalFieldSize: Ref<number> = ref(7)
  const verticalFieldSize: Ref<number> = ref(8)
  const isFieldMirrored: Ref<boolean> = ref(true)

  // width and height of the field and the computed square size in pixels
  // (updated by the UI)
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

  const positionOfZone: ComputedRef<(zone: String) => [number, number]> =
    computed(() => {
      return (zone: String) => {
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
    // do not change referee boolean value
    popupCounter.value = 10
    horizontalFieldSize.value = 7
    verticalFieldSize.value = 8
    isFieldMirrored.value = true
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    refereeView,
    popupCounter,
    isFieldMirrored,
    horizontalFieldSize,
    verticalFieldSize,
    fullHorizontalFieldSize,
    fieldWidthPixels,
    fieldHeightPixels,
    squareDiameterPixels,
    positionOfZone,
    positionOfRobot,
    reset,
  }
})
