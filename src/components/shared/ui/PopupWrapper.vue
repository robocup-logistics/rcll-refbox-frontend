// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="popup-wrapper">
    <div class="reference" ref="reference" @click="togglePopup">
      <slot name="reference"></slot>
    </div>
    <div
      v-if="popupOpen"
      class="popup"
      ref="popup"
      :style="[floatingStyles, { 'z-index': zIndex }]"
    >
      <slot></slot>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, provide } from 'vue'
import type { PropType, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import type { Placement } from '@floating-ui/vue'
import { useViewStore } from '@/store/viewStore'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  popupPosition: {
    type: String as PropType<Placement>,
    required: false,
    default: 'right-start',
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const viewStore = useViewStore()
const { popupCounter } = storeToRefs(viewStore)

// floating popup  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> setting up floating ui
const reference: Ref<HTMLElement | null> = ref(null)
const popup: Ref<HTMLElement | null> = ref(null)
const { floatingStyles } = useFloating(reference, popup, {
  placement: props.popupPosition,
  middleware: [offset(5), flip(), shift({ padding: 10 })],
  whileElementsMounted: autoUpdate,
})

// -> correct z-index
const zIndex: Ref<number> = ref(0)

// -> open/close logic
const popupOpen = ref(false)
function togglePopup() {
  zIndex.value = popupCounter.value
  popupCounter.value++
  popupOpen.value = !popupOpen.value
}
provide('togglePopup', togglePopup)
</script>

// STYLES ----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.popup-wrapper {
  height: 100%;

  .reference {
    height: 100%;
    /* to make sure items in horizontal flex containers are well aligned */
    display: flex;
  }
}
</style>
