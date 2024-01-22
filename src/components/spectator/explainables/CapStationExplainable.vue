// TEMPLATE --------------------------------------------------------------------
<template>
  <Explainable term="Cap Station">
    <p>At a cap station, a robot can perform two different actions:</p>
    <p>
      <span> - The first is to put a </span>
      <WorkpieceExplainable />
      <span>
        at the input and ask the machine to retrieve the and store it on a
        slider on the machine. For this purpose, workpieces consisting of a
        clear base and the desired cap stand ready at the right side of the
        input. The clear bases are not needed to fulfill orders but might be
        used to pay at ring stations.
      </span>
    </p>
    <p>
      - As the second action, the robot can deliver a workpiece at the input and
      ask the machine to mount the previously retrieved cap onto the workpiece.
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
