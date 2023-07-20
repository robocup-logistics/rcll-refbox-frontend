import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useFieldStore = defineStore('fieldStore', () => {
  // size of the playing field
  const horizontalSize: Ref<number> = ref(14)
  const verticalSize: Ref<number> = ref(8)

  return { horizontalSize, verticalSize }
})
