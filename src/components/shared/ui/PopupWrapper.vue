// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="popup-wrapper">
    <div class="reference clickable" ref="reference" @click="togglePopup">
      <slot name="reference"></slot>
    </div>
    <div
      v-if="popupOpen"
      class="popup"
      ref="popup"
      :style="[floatingStyles, { 'z-index': zIndex }]"
      @click="placePopupOnTop"
    >
      <div
        ref="floatingArrow"
        :class="[
          'arrow-wrapper',
          placement == 'right' ? 'left' : '',
          placement == 'left' ? 'right' : '',
          placement == 'bottom' ? 'top' : '',
          placement == 'top' ? 'bottom' : '',
        ]"
      >
        <div class="arrow"></div>
      </div>

      <slot class="clickable"></slot>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, provide } from 'vue'
import type { PropType, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
} from '@floating-ui/vue'
import type { Placement } from '@floating-ui/vue'
import { useViewStore } from '@/store/viewStore'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  popupPosition: {
    type: String as PropType<Placement>,
    required: false,
    default: 'right',
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const viewStore = useViewStore()
const { popupCounter } = storeToRefs(viewStore)

// floating popup  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> setting up floating ui
const reference: Ref<HTMLElement | null> = ref(null)
const popup: Ref<HTMLElement | null> = ref(null)
const floatingArrow: Ref<HTMLElement | null> = ref(null)
const { floatingStyles, middlewareData, placement } = useFloating(
  reference,
  popup,
  {
    placement: props.popupPosition,
    middleware: [
      offset(15),
      flip(),
      shift({ padding: 10 }),
      arrow({ element: floatingArrow }),
    ],
    whileElementsMounted: autoUpdate,
  }
)

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
  if (popupOpen.value == false) {
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
  height: fit-content;

  .reference {
    height: fit-content;
    /* to make sure items in horizontal flex containers are well aligned */
    display: flex;
  }

  .popup {
    .arrow-wrapper {
      $arrowSize: 20px;
      $hideFactor: -1;
      position: absolute;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;

      .arrow {
        position: absolute;
        width: calc($arrowSize * 2);
        height: calc($arrowSize * 2);
        background-color: global.$lighterColor;
        box-shadow: 0 0 6px 1px global.$bgColor;
        border-radius: 2px;
      }

      &.top {
        top: calc($arrowSize * $hideFactor * 2);
        left: calc(v-bind('middlewareData?.arrow?.x') * 1px);
        width: calc($arrowSize * 4);
        height: calc($arrowSize * 2);

        .arrow {
          left: $arrowSize;
          transform: translateY(calc($arrowSize * 1)) scale(0.7) rotate(45deg);
        }
      }

      &.right {
        right: calc($arrowSize * $hideFactor * 2);
        top: calc(v-bind('middlewareData?.arrow?.y') * 1px);
        width: calc($arrowSize * 2);
        height: calc($arrowSize * 4);

        .arrow {
          top: $arrowSize;
          transform: translateX(calc($arrowSize * -1)) scale(0.7) rotate(45deg);
        }
      }

      &.bottom {
        bottom: calc($arrowSize * $hideFactor * 2);
        left: calc(v-bind('middlewareData?.arrow?.x') * 1px);
        width: calc($arrowSize * 4);
        height: calc($arrowSize * 2);

        .arrow {
          left: $arrowSize;
          transform: translateY(calc($arrowSize * -1)) scale(0.7) rotate(45deg);
        }
      }

      &.left {
        left: calc($arrowSize * $hideFactor * 2);
        top: calc(v-bind('middlewareData?.arrow?.y') * 1px);
        width: calc($arrowSize * 2);
        height: calc($arrowSize * 4);

        .arrow {
          top: $arrowSize;
          transform: translateX(calc($arrowSize * 1)) scale(0.7) rotate(45deg);
        }
      }
    }
  }
}
</style>
