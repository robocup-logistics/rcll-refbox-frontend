// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="'Machine ' + machine.name">
    <!-- ABOUT MACHINE TYPE -->
    <div>
      <span>Type: </span>
      <BaseStationExplainable v-if="machine.mtype == 'BS'" />
      <CapStationExplainable v-else-if="machine.mtype == 'CS'" />
      <DeliveryStationExplainable v-else-if="machine.mtype == 'DS'" />
      <RingStationExplainable v-else-if="machine.mtype == 'RS'" />
      <StorageStationExplainable v-else-if="machine.mtype == 'SS'" />
    </div>

    <!-- BASE STATION -->
    <template v-if="machine.mtype == 'BS'">
      <p>Available bases:</p>
      <div class="content-box horizontal-flex">
        <img :src="`/workpieces/BASE_BLACK.svg`" alt="BASE_BLACK" />
        <img :src="`/workpieces/BASE_RED.svg`" alt="BASE_RED" />
        <img :src="`/workpieces/BASE_SILVER.svg`" alt="BASE_SILVER" />
      </div>
    </template>

    <!-- CAP STATION -->
    <template v-else-if="machine.mtype == 'CS'">
      <div class="content-box shelf">
        <div class="shelf-level cs">
          <div class="shelf-item" v-for="i in 3">
            <img
              :src="`/workpieces/BASE_TRANSPARENT-${(<MachineCS>machine).cs_color}.svg`"
              :alt="`BASE_TRANSPARENT-${(<MachineCS>machine).cs_color}`"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- DELIVERY STATION -->
    <template v-else-if="machine.mtype == 'DS'"> </template>

    <!-- RING STATION -->
    <template v-else-if="machine.mtype == 'RS'">
      <p>Available rings:</p>
      <div
        v-for="ringColor in (<MachineRS>machine)['rs_ring_colors']"
        class="horizontal-flex content-box"
      >
        <img :src="`/workpieces/${ringColor}.svg`" :alt="ringColor" />
        <div class="horizontal-flex">
          <font-awesome-icon icon="fa-coins" />
          <p>
            {{
              ringspecs.find((ringspec) => ringspec.color == ringColor)
                ?.req_bases
            }}
            bases
          </p>
        </div>
      </div>
    </template>

    <!-- STORAGE STATION -->
    <template v-else-if="machine.mtype == 'SS'">
      <div class="content-box shelf">
        <div class="shelf-level ss" v-for="l in 6">
          <div class="shelf-item" v-for="i in 8">
            <img
              :src="`/workpieces/BASE_RED-CAP_GREY.svg`"
              alt="BASE_RED - CAP_GREY"
            />
          </div>
        </div>
      </div>
    </template>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import type { PropType } from 'vue'
import type Machine from '@/types/Machine'
import type MachineRS from '@/types/MachineRS'
import Popup from '@/components/shared/ui/Popup.vue'
import { useMachineStore } from '@/store/machineStore'
import { storeToRefs } from 'pinia'
import {
  RING_BLUE,
  RING_GREEN,
  RING_ORANGE,
  RING_YELLOW,
} from '@/assets/exports.module.scss'
import BaseStationExplainable from '@/components/spectator/explainables/BaseStationExplainable.vue'
import CapStationExplainable from '@/components/spectator/explainables/CapStationExplainable.vue'
import DeliveryStationExplainable from '@/components/spectator/explainables/DeliveryStationExplainable.vue'
import RingStationExplainable from '@/components/spectator/explainables/RingStationExplainable.vue'
import StorageStationExplainable from '@/components/spectator/explainables/StorageStationExplainable.vue'
import type MachineCS from '@/types/MachineCS'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  machine: {
    type: Object as PropType<Machine>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const machineStore = useMachineStore()
const { ringspecs } = storeToRefs(machineStore)

// type info - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const machineTypeNames: Map<string, string> = new Map([
  ['BS', 'Base station'],
  ['CS', 'Cap station'],
  ['DS', 'Delivery station'],
  ['RS', 'Ring station'],
  ['SS', 'Storage station'],
])

const machineTypeDescriptions: Map<string, string> = new Map([
  ['BS', 'Base station'],
  ['CS', 'Cap station'],
  ['DS', 'Delivery station'],
  ['RS', 'Ring station'],
  ['SS', 'Storage station'],
])

// ring stations - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function getColor(ring: string) {
  switch (ring) {
    case 'RING_BLUE':
      return RING_BLUE
    case 'RING_GREEN':
      return RING_GREEN
    case 'RING_ORANGE':
      return RING_ORANGE
    case 'RING_YELLOW':
      return RING_YELLOW
  }
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.shelf {
  display: block;
  padding: 60px 50px;
  position: relative;

  &:before {
    content: 'SHELF';
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: global.$itemColor;
    padding: 0 5px;
    border-radius: 5px;
  }

  .shelf-level {
    margin: -30px 0;
    transform: rotateX(50deg) rotateZ(30deg);

    display: grid;
    gap: 5px;

    &.cs {
      grid-template-columns: 1fr 1fr 1fr;

      &:after {
        content: 'Sample shelf, not live';
        position: absolute;
        top: -30px;
        right: 0px;
        background-color: global.$itemColor;
        padding: 0 5px;
        border-radius: 5px;
      }
    }

    &.ss {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .shelf-item {
      aspect-ratio: 1;
      background-color: global.$bgColorLighter;
      border-radius: 5px;

      img {
        transform: rotateX(-30deg) rotateZ(-30deg);
      }
    }
  }
}
</style>
