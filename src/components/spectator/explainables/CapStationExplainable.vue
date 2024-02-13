// TEMPLATE --------------------------------------------------------------------
<template>
  <Explainable term="Cap Station">
    <p>At a cap station a robot can pick up cap-carriers from the station's
       shelf. The Station then can retrieve it's cap and later mount it to a
       different product.</p>
    <p>
      <span> Each shelf of a cap station initially holds 3 cap-carriers, which are
        special </span>
      <WorkpieceExplainable />
      <span>
        that consist of a clear (transparent) base and either a grey or
        black cap.
        A human may replenish the shelf every time it is empty.
        Each team has two cap stations, one with cap-carriers holding black
        cap, and one with cap-carriers holding grey caps.
      </span>
    </p>
    <p>
        Once a cap-carrier is placed at the input, a robot may request the
        machine to retrieve it's cap, buffering it until later usage.
        the cap-less cap-carrier is transported to the machine's output,
        ready for pickup.
        It is not needed to fulfill orders directly, but can be used for
        payments at the
      <RingStationExplainable />, or alternatively can be discarded at the
      <DeliveryStationExplainable />.
        Each cap station can only buffer one cap at a time.
    </p>
    <p>
       Once a cap is buffered in the cap station, the robot can deliver a
       workpiece at the input and request the machine to mount the stored cap
       onto the workpiece.
    </p>
  </Explainable>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Explainable from '@/components/shared/util/Explainable.vue'
import WorkpieceExplainable from '@/components/spectator/explainables/WorkpieceExplainable.vue'
import RingStationExplainable from '@/components/spectator/explainables/RingStationExplainable.vue'
import DeliveryStationExplainable from '@/components/spectator/explainables/DeliveryStationExplainable.vue'
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
