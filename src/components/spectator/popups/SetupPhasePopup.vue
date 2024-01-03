// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Setup phase">
    <div>
      <SetupPhaseExplainable />
    </div>
    <p>Duration: {{ formatTime(SETUP_DURATION) }}</p>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import Popup from '@/components/shared/ui/Popup.vue'
import { useRuleStore } from '@/store/ruleStore'
import formatTime from '@/utils/formatTime'
import SetupPhaseExplainable from '@/components/spectator/explainables/SetupPhaseExplainable.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const ruleStore = useRuleStore()
const { SETUP_DURATION } = storeToRefs(ruleStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
