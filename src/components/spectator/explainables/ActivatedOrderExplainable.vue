// TEMPLATE --------------------------------------------------------------------
<template>
  <Explainable term="Activated order">
    <p>
      With the start of the production phase, not all orders are directly
      communicated to the robots. Robots only know a subset of all orders,
      namely those that are <b>activated</b>. An order is usually activated a
      few minutes before its production window begins.
    </p>
  </Explainable>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Explainable from '@/components/shared/util/Explainable.vue'
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
