// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="options-bar item">
    <PillButton
      :description="gamestate == 'RUNNING' ? 'Pause' : 'Run'"
      :title="gamestate == 'RUNNING' ? 'Pause game' : 'Run game'"
      @click="toggleState"
    >
      <font-awesome-icon
        :icon="gamestate == 'RUNNING' ? 'fa-pause' : 'fa-play'"
      />
    </PillButton>
    <PillButton description="Speed" title="toggle speed" @click="toggleSpeed">
      {{ gameSpeed }}x
    </PillButton>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useGameStore } from '@/store/gameStore'
import { useReportStore } from '@/store/reportStore'
import { storeToRefs } from 'pinia'
import PillButton from '@/components/shared/ui/PillButton.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { gamestate } = storeToRefs(gameStore)
const reportStore = useReportStore()
const { gameSpeed } = storeToRefs(reportStore)

// speed - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const nextSpeeds = new Map([
  [0.5, 1],
  [1, 2],
  [2, 4],
  [4, 0.5],
])
function toggleSpeed() {
  console.log('TOGGLING SPEED')
  gameSpeed.value = <number>nextSpeeds.get(gameSpeed.value)
}

// run/pause - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function toggleState() {
  if (gamestate.value == 'WAIT_START' || gamestate.value == 'PAUSED') {
    reportStore.runGame()
  } else if (gamestate.value == 'RUNNING') {
    gamestate.value = 'PAUSED'
  }
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.options-bar {
  width: 70px !important;
  gap: 10px !important;
  justify-content: space-evenly !important;
}
</style>
