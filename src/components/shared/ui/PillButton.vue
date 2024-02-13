// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="pill-button clickable">
    <div class="pill flex-item">
      <slot></slot>
    </div>
    <p>{{ description }}</p>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  description: String,
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.pill-button {
  flex-grow: 0;

  text-align: center;
  width: fit-content;
  min-width: 50px;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 5px;

  p {
    font-size: 13px;
    text-transform: uppercase;
  }
  .pill {
    width: 100%;
    height: 26px;
    border-radius: 13px;
    background-color: global.$lighterColor;
    color: white;

    font-size: 13px;
  }
}
</style>
