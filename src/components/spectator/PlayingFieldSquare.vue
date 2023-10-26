// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="playing-field-square">
    <p class="zone-info">{{ zone }}</p>
    <template v-if="machine">
      <MachineEntity :machine="machine"></MachineEntity>
    </template>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import type Machine from '@/types/Machine'
import MachineEntity from './entities/MachineEntity.vue'
import { useMachineStore } from '@/store/machineStore'
import { ComputedRef, computed } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const machineStore = useMachineStore()
const { machines } = storeToRefs(machineStore)

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  zone: {
    type: String,
    required: true,
  },
})

// associated machine  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const machine: ComputedRef<Machine | undefined> = computed(() => {
  return machines.value.find((machineArr) => machineArr.zone == props.zone)
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.playing-field-square {
  aspect-ratio: 1;
  background-color: global.$bgColorLighter;
  border-radius: 5px;
  position: relative;

  .zone-info {
    display: none;
    z-index: 3;

    position: absolute;
    bottom: 2px;
    right: 10px;

    font-size: 10px;
    color: global.$bgColorDarker;
  }

  &:hover {
    .zone-info {
      display: unset;
    }
  }
}
</style>
