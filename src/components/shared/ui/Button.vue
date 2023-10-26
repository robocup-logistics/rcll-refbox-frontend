// TEMPLATE --------------------------------------------------------------------
<template>
  <button
    :class="['horizontal-flex', 'clickable', { primary: props.primary }]"
    :disabled="props.disabled"
    :type="submit ? 'submit' : undefined"
  >
    <template v-if="loading">
      <span>Loading</span>
      <font-awesome-icon icon="fa-solid fa-spinner" spin />
    </template>
    <template v-else>
      <slot></slot>
      <font-awesome-icon v-if="icon" :icon="`fa-solid ${icon}`" />
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
  padding: 7px 10px;
  border-radius: 5px;
  color: white;
  background-color: global.$bgColorLighter;
  flex-grow: 0 !important;
  overflow-x: hidden !important;
  min-width: fit-content;

  &.primary {
    background-color: global.$accentColor;
  }
}
</style>
