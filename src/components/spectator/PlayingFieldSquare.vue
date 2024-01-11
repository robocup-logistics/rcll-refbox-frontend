// TEMPLATE --------------------------------------------------------------------
<template>
  <div :class="['playing-field-square', withDot ? 'with-dot' : '']">
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
  withDot: {
    type: Boolean,
    required: false,
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
  background-color: global.$lighterColor;
  border-radius: 8px;

  position: relative;
  transition: background-color 400ms;

  &.with-dot {
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 5px;
      width: 5px;
      border-radius: 5px;
      background-color: global.$bgColor;
      transform: translate(-50%, -50%);
    }
  }

  .zone-info {
    display: none;

    position: absolute;
    bottom: 2px;
    right: 10px;

    font-size: 12px;
    color: global.$bgColor;
  }

  &:hover {
    .zone-info {
      display: unset;
    }
  }
}
</style>
