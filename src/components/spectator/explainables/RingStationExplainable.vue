// TEMPLATE --------------------------------------------------------------------
<template>
  <Explainable term="Ring Station" icon="fa-gears">
    <p>
      <span> At a ring station, a robot can put a </span>
      <WorkpieceExplainable />
      <span>
        at a input and choose the ring color it wants to be mounted onto the
        workpiece. Note that some ring colors require a payment in the form of a
        number of bases. In this case, the robot has to put the bases for
        payment at a slide on the machine before it asks the machine to mount
        the ring. After the mount, the robot can pick up the new workpiece at
        the output.
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
