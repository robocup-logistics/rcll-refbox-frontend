// TEMPLATE --------------------------------------------------------------------
<template>
  <button
    :class="['horizontal-flex', 'clickable', { primary: props.primary }]"
    :disabled="props.disabled"
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
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
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
  border-radius: 8px;
  color: white;
  background-color: global.$lighterColor;
  flex-grow: 0 !important;
  flex-shrink: 0 !important;
  overflow-x: hidden !important;
  width: fit-content;
  height: fit-content;
  /* for tab groups */
  transition: background-color 00ms;

  &.primary {
    background-color: global.$accentColor;
  }
}
</style>
