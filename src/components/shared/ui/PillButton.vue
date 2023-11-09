// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="pill-button clickable">
    <div class="pill item">
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
  text-align: center;
  width: 100%;
  min-width: 50px;

  display: flex;
  flex-direction: column;
  gap: 5px;

  p {
    font-size: 12px;
    text-transform: uppercase;
  }
  .pill {
    width: 100%;
    height: 26px;
    border-radius: 13px;
    background-color: global.$bgColorLighter;
    color: white;

    font-size: 15px;
  }
}
</style>
