// TEMPLATE --------------------------------------------------------------------
<template>
  <Explainable term="Delivery Station">
    <p>
      <span> At a delivery station, a robot can deliver a fabricated </span>
      <ProductExplainable />
      <span> in order to fulfill an order. </span>
    </p>
    <p>
      Also, any workpiece not fulfilling an order may be delivered to the station to remove it from the field.
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
