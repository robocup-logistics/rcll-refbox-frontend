// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Select game speed" icon="fa-gauge">
    <TabGroup :tabs="speeds" v-model:active="gameSpeed">
      <template #[speed] v-for="speed in speeds">
        <p>{{ speed }}x</p>
      </template>
    </TabGroup>
    <form class="horizontal-flex" @submit.prevent="updateSpeed">
      <Input
        placeholder="custom speed"
        type="number"
        min="0"
        step="0.5"
        v-model="inputSpeed"
      />
      <Button :disabled="!inputSpeedValid" type="submit">Set</Button>
    </form>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { type Ref, ref, computed, type ComputedRef } from 'vue'
import TabGroup from '@/components/shared/ui/TabGroup.vue'
import { useReportStore } from '@/store/reportStore'
import { storeToRefs } from 'pinia'
import Input from '@/components/shared/ui/Input.vue'
import Button from '@/components/shared/ui/Button.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const reportStore = useReportStore()
const { gameSpeed } = storeToRefs(reportStore)

// game speed  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const speeds: Ref<number[]> = ref([0.5, 1, 2, 4, 8])
const inputSpeed: Ref<number | undefined> = ref(undefined)
const inputSpeedValid: ComputedRef<boolean> = computed(() => {
  if (inputSpeed.value && inputSpeed.value > 0) {
    return true
  } else {
    return false
  }
})

function updateSpeed() {
  if (inputSpeedValid) {
    gameSpeed.value = inputSpeed.value as number
    inputSpeed.value = undefined
  }
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
