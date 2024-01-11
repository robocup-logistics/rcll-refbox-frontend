// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="popup">
    <div class="popup-header horizontal-flex">
      <h1 v-html="title" class="uppercase"></h1>
      <div class="divider"></div>
      <font-awesome-icon
        icon="fa-xmark"
        class="clickable close-icon"
        @click="togglePopup"
        v-if="!permanent"
      />
    </div>
    <div class="wrapper" ref="scrollContainer">
      <div class="popup-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { type Ref, inject, ref, provide } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  title: String,
  permanent: Boolean, // whether the popup should be closable
})

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
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.popup {
  min-width: 250px;
  max-width: 30vw;
  max-height: 50vh;

  border-radius: 8px;
  background-color: rgba(global.$surfaceColor, 0.95);
  box-shadow: 0 0 6px 3px rgba(global.$bgColor, 0.8);
  text-align: left;
  color: white;

  /* * {
    flex-shrink: 0;
  } */

  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .popup-header {
    flex-shrink: 0;
    width: 100%;
    /* so items in the body do not appear on top */
    z-index: 2;
    overflow: hidden;

    h1 {
      flex-shrink: 0;
      font-size: 20px;
    }

    .divider {
      flex-shrink: 1;
      width: 100%;
      height: 1px;
      background-color: global.$lighterColor;
    }

    .close-icon {
      padding: 10px;
      margin: -10px;
    }
  }

  .wrapper {
    overflow: auto;
    .popup-content {
      display: grid;
      gap: 10px;
    }
  }
}
</style>
