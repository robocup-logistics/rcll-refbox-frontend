// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Setup phase">
    <SetupPhaseExplainable />
    <p>Duration: {{ formatTime(SETUP_DURATION) }}</p>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import Popup from '@/components/shared/ui/Popup.vue'
import { useGameStore } from '@/store/gameStore'
import formatTime from '@/utils/formatTime'
import SetupPhaseExplainable from '@/components/spectator/explainables/SetupPhaseExplainable.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { SETUP_DURATION } = storeToRefs(gameStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
