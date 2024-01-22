// TEMPLATE --------------------------------------------------------------------
<template>
  <button
    :class="['horizontal-flex', { clickable: !disabled }, { primary: primary }]"
    :disabled="disabled"
    :type="submit ? 'submit' : undefined"
  >
    <template v-if="loading">
      <span>Loading</span>
      <font-awesome-icon icon="fa-spinner" spin />
    </template>
    <template v-else>
      <slot></slot>
      <font-awesome-icon v-if="icon" :icon="icon" />
    </template>
  </button>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  icon: String,
  primary: Boolean,
  disabled: Boolean,
  loading: Boolean,
  submit: Boolean,
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

button {
  padding: 10px 15px;
  border-radius: 12px;
  color: white;
  background-color: global.$lighterColor;
  filter: drop-shadow(0px 1px 3px rgba(global.$bgColor, 0.8));
  flex-grow: 0 !important;
  flex-shrink: 0 !important;
  overflow-x: hidden !important;
  width: fit-content;

  /* for tab groups */
  transition: background-color 400ms;

  &.primary {
    background-color: global.$accentColor;
  }

  &:disabled {
    background-color: global.$lightestColor;
    opacity: 0.3;
    cursor: not-allowed;
  }
}
</style>
