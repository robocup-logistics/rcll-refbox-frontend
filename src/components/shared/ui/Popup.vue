// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="popup">
    <div class="popup-header">
      <h1 v-html="title" class="uppercase"></h1>
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        class="clickable"
        @click="togglePopup"
        v-if="!permanent"
      />
    </div>
    <div class="wrapper">
      <div class="popup-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { inject } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  title: String,
  permanent: Boolean, // whether the popup should be closable
})

// popup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

  border-radius: 5px;
  background-color: rgba(global.$bgColor, 0.95);
  box-shadow: 0 0 6px 3px rgba(global.$bgColor, 0.8);
  text-align: left;
  color: white;

  /* * {
    flex-shrink: 0;
  } */

  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .popup-header {
    width: 100%;
    /* so items in the body do not appear on top */
    z-index: 2;
    background-color: rgba(global.$accentColor, 0.8);

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    border-radius: 5px;
    padding: 10px 15px;
    text-transform: unset;

    h1 {
      font-size: 20px;
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
