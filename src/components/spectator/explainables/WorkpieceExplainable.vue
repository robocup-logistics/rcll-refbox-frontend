// TEMPLATE --------------------------------------------------------------------
<template>
  <Explainable term="Workpiece">
    <p>
      <span> In contradiction to the term </span>
      <ProductExplainable />
      <span>
        , 'Workpieces', a superset of 'Products', describe an arbitrary assembly
        of bases, rings and caps. We call a single base a workpiece like we do
        with a base at which we just mounted a ring but that still does not have
        a cap. Finished products are also workpieces.
      </span>
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
