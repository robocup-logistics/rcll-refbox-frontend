// TEMPLATE --------------------------------------------------------------------
<template>
  <Explainable term="Delivery Station" icon="fa-gears">
    <p>
      <span> At a delivery station, a robot can deliver a fabricated </span>
      <ProductExplainable />
      <span> in order to fulfill an order. </span>
    </p>
  </Explainable>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Explainable from '@/components/shared/util/Explainable.vue'
import ProductExplainable from '@/components/spectator/explainables/ProductExplainable.vue'
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
