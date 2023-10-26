import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { Ref } from 'vue'

// main pinia store
export const useRuleStore = defineStore('ruleStore', () => {
  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // duratioms
  const SETUP_DURATION: Ref<number> = ref(300)
  const PRODUCTION_DURATION: Ref<number> = ref(1200)
  const OVERTIME_DURATION: Ref<number> = ref(300)
  const MAINTENANCE_DURATION: Ref<number> = ref(120)

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    SETUP_DURATION,
    PRODUCTION_DURATION,
    OVERTIME_DURATION,
    MAINTENANCE_DURATION,
  }
})
