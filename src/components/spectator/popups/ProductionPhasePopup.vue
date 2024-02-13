// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Production phase">
    <div>
      <ProductionPhaseExplainable />
    </div>
    <p>Duration: {{ formatTime(PRODUCTION_DURATION) }}</p>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import Popup from '@/components/shared/ui/Popup.vue'
import { useGameStore } from '@/store/gameStore'
import formatTime from '@/utils/formatTime'
import ProductionPhaseExplainable from '@/components/spectator/explainables/ProductionPhaseExplainable.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { PRODUCTION_DURATION } = storeToRefs(gameStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
