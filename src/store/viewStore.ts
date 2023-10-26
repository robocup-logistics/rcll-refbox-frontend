import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { defineStore } from 'pinia'

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
    reset,
  }
})
