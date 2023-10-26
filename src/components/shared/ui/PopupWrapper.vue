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
      @click="placePopupOnTop"
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

// -> make sure the popup is on top
// this function is called when the popup is opened as well as when clicks
// happen. It makes sure that this popup has the largest z-index. To make the
// z-index to grow and grow and have negative performance implications with each
// click, we only increase it if necessary
function placePopupOnTop() {
  if (zIndex.value != popupCounter.value) {
    zIndex.value = popupCounter.value
    popupCounter.value++
  }
}

// -> open/close logic
const popupOpen = ref(false)
function togglePopup() {
  if ((popupOpen.value = false)) {
    placePopupOnTop()
  }
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
