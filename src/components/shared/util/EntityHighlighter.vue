This component is deprecated but might be used for other purposes in the future
// TEMPLATE --------------------------------------------------------------------
<template>
  <span class="entity-highlighter horizontal-flex clickable">
    <font-awesome-icon v-if="type == 'robot'" icon="fa-robot" spin />
    <font-awesome-icon v-else-if="type == 'machine'" icon="fa-robot" />
    <span>{{ name }}</span>
  </span>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useViewStore } from '@/store/viewStore'
import { storeToRefs } from 'pinia'
import { PropType } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  type: {
    type: String as PropType<'robot' | 'machine'>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  target: {
    type: String, // in the `highlighted` format, see viewStore
    required: true,
  },
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.entity-highlighter {
  padding: 2px 5px;
  border-radius: 5px;
  color: white;
  font-size: 15px;
  background-color: global.$bgColorLighter;
  flex-grow: 0 !important;
  overflow-x: hidden !important;
  width: fit-content;
}
</style>
