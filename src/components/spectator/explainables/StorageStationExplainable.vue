// TEMPLATE --------------------------------------------------------------------
<template>
  <Explainable term="Storage Station" icon="fa-gears">
    <p>
      <span>
        At a storage station, a robot can either deposit or withdraw any
      </span>
      <WorkpieceExplainable />
      <span>
        . At the beginning of a game, a storage station is pre-filled with some
        workpieces that a robot can use to fulfill orders quicker.
      </span>
    </p>
  </Explainable>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Explainable from '@/components/shared/util/Explainable.vue'
import WorkpieceExplainable from '@/components/spectator/explainables/WorkpieceExplainable.vue'
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
