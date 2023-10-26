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
    <div class="popup-body">
      <slot></slot>
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
  background-color: rgba(global.$bgColor, 0.9);
  box-shadow: 0 0 6px 3px rgba(global.$bgColor, 0.8);
  text-align: left;
  color: white;

  overflow: auto;

  .popup-header {
    /* so items in the body do not appear on top */
    z-index: 2;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    height: 60px;
    padding: 0 15px 0 15px;
    text-transform: unset;

    background-color: rgba(global.$accentColor, 0.8);

    position: sticky;
    top: 0;

    h1 {
      font-size: 20px;
    }
  }
  .popup-body {
    display: flex;
    flex-direction: column;
    gap: 10px;

    max-width: 100%;
    padding: 15px;
  }
}
</style>
