// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Jump to" icon="fa-timeline" v-if="gameReport">
    <input
      type="range"
      min="0"
      :max="gameReport?.game_end_time"
      :value="cont_time"
      @input="(e: Event) => reportStore.jumpTo(parseInt((e.target as HTMLInputElement).value))"
    />
    <div class="horizontal-flex time-input">
      <span>Total time:</span>
      <Input class="input" type="number" v-model="minutes" />
      <span>:</span>
      <Input class="input" type="number" v-model="seconds" />
      <span>/ {{ formatTime(gameReport.game_end_time) }}</span>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { useGameStore } from '@/store/gameStore'
import { useReportStore } from '@/store/reportStore'
import { storeToRefs } from 'pinia'
import formatTime from '@/utils/formatTime'
import Input from '@/components/shared/ui/Input.vue'
import { type WritableComputedRef, computed } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { cont_time } = storeToRefs(gameStore)
const reportStore = useReportStore()
const { gameReport } = storeToRefs(reportStore)

// jump in time  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const minutes: WritableComputedRef<number> = computed({
  get() {
    return Math.floor(cont_time.value / 60)
  },
  set(val: number) {
    jumpTo(val, seconds.value)
  },
})

const seconds: WritableComputedRef<number> = computed({
  get() {
    return Math.round(cont_time.value % 60)
  },
  set(val: number) {
    jumpTo(minutes.value, val)
  },
})

function jumpTo(minutes: number, seconds: number) {
  const newContTime = minutes * 60 + seconds
  if (
    gameReport.value &&
    newContTime >= 0 &&
    newContTime <= gameReport.value.game_end_time
  ) {
    reportStore.jumpTo(newContTime)
  }
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.time-input {
  .input {
    width: 65px !important;
    flex-grow: 0 !important;
  }
}
</style>
