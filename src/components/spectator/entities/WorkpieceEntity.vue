// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="workpiece-entity">
    <img :src="`/workpieces/${workpieceFileName}`" alt="img" />
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { computed, type ComputedRef, type PropType } from 'vue'
import type Workpiece from '@/types/Workpiece'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  workpiece: {
    type: Object as PropType<Workpiece>,
    required: true,
  },
})

// get workpiece file name - - - - - - - - - - - - - - - - - - - - - - - - - - -
const workpieceFileName: ComputedRef<string> = computed(() => {
  const parts = []
  if (props.workpiece.base_color) parts.push(props.workpiece.base_color)
  parts.push(...props.workpiece.ring_colors)
  if (props.workpiece.cap_color) parts.push(props.workpiece.cap_color)
  return `${parts.join('-')}.svg`
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.workpiece-entity {
  position: relative;

  img {
    height: 20px;
    aspect-ratio: 1;
  }
}
</style>
