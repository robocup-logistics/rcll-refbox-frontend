// TEMPLATE --------------------------------------------------------------------
<template>
  <a :href="href" target="_blank">
    <Button :primary="primary" icon="fa-arrow-up-right-from-square">
      <slot></slot>
    </Button>
  </a>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Button from '@/components/shared/ui/Button.vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  href: {
    type: String,
    required: true,
  },
  primary: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

a {
  text-decoration: unset;
}
</style>
