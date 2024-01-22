// TEMPLATE --------------------------------------------------------------------
<template>
  <Explainable term="Expired order">
    <p>
      An order may still be fulfilled for some time after it has expired but the
      longer it has expired the fewer points it rewards
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
