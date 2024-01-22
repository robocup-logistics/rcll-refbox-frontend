// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="popup">
    <!-- we wrap the shortcut logic in a conditional div to allow modals to
    define their own escape shortcuts (togglePopup does not work for them)-->
    <div
      v-if="!permanent"
      style="display: none"
      v-shortkey.once="(shortcuts.get('dismissPopup') as Shortcut).keys"
      @shortkey="togglePopup()"
    ></div>
    <div class="popup-header horizontal-flex">
      <font-awesome-icon v-if="icon" :icon="icon" class="icon" />
      <h1 v-html="title" class="uppercase"></h1>
      <div class="divider"></div>
      <font-awesome-icon
        icon="fa-xmark"
        class="clickable close-icon"
        @click="togglePopup"
        v-if="!permanent"
      />
    </div>
    <div class="popup-body-wrapper" ref="scrollContainer">
      <div class="popup-body vertical-flex">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useKeyboardStore } from '@/store/keyboardStore'
import Shortcut from '@/types/Shortcut'
import { storeToRefs } from 'pinia'
import { type Ref, inject, ref, provide } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  title: String,
  permanent: {
    type: Boolean, // whether the popup should be closable
    required: false,
  },
  icon: {
    type: String, // font-awesome name
    required: false,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const keyboardStore = useKeyboardStore()
const { shortcuts } = storeToRefs(keyboardStore)

// popup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> scroll to top
const scrollContainer: Ref<HTMLDivElement | null> = ref(null)
function scrollToTop() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: 0 })
  }
}
provide('scrollToTop', scrollToTop)

// -> close
const togglePopup = inject('togglePopup') as Function

defineExpose({ scrollToTop })
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.popup {
  min-width: 360px;
  width: 100%;
  max-width: 30vw;
  max-height: 50vh;

  border-radius: 12px;
  background-color: rgba(global.$surfaceColor, 0.95);
  box-shadow: 0 0 6px 3px rgba(global.$bgColor, 0.8);
  text-align: left;
  color: white;
  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  .popup-header {
    min-width: max-content !important;
    width: calc(100% - 10px) !important;
    flex-shrink: 0;
    /* so items in the body do not appear on top */
    z-index: 2;
    overflow-x: hidden;

    .icon {
      flex-shrink: 0;
    }

    h1 {
      flex-shrink: 0;
      flex-wrap: wrap;
      font-size: 20px;

      :deep(*) {
        font-size: 20px !important;
      }
    }

    .divider {
      flex-shrink: 1;
      width: 100%;
      height: 1px;
      background-color: global.$lighterColor;
    }

    .close-icon {
      flex-shrink: 0;
      padding: 10px;
      margin: -10px;
    }
  }

  .popup-body-wrapper {
    overflow-y: auto;
  }
}
</style>
