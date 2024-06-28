// TEMPLATE --------------------------------------------------------------------
<template>
  <div
    :class="[
      'playing-field-square',
      withDot ? 'with-dot' : '',
      isSelected ? 'selected' : '',
      isTargeted ? 'targeted' : '',
    ]"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
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
import { ComputedRef, ref, watch, computed } from 'vue'

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
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isTargeted: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['square-selected', 'square-targeted'])

// Reactive references for isSelected and isTargeted
const isSelected = ref(props.isSelected)
const isTargeted = ref(props.isTargeted)

// Watch props to update reactive properties
watch(
  () => props.isSelected,
  (newValue) => {
    isSelected.value = newValue
  },
)
watch(
  () => props.isTargeted,
  (newValue) => {
    isTargeted.value = newValue
  },
)

// associated machine  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const machine: ComputedRef<Machine | undefined> = computed(() => {
  return machines.value.find((machineArr) => machineArr.zone == props.zone)
})

// handle mouse events - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Handle mouse down event to trigger square selection or targeting
const handleMouseDown = () => {
  emit('square-selected', { zone: props.zone, withDot: props.withDot })
}

// Handle mouse up event to trigger square targeting
const handleMouseUp = () => {
  emit('square-targeted', { zone: props.zone, withDot: props.withDot })
}
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

  &.selected {
    border: 2px solid blue; // Highlight selected square
    background-color: global.$surfaceColor;
  }

  &.targeted {
    border: 2px solid red; // Highlight targeted square
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
