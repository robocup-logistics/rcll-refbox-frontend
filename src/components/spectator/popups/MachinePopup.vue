// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="'Machine ' + machine.name">
    <!-- ABOUT MACHINE TYPE -->
    <div class="horizontal-flex">
      <span>Type: {{ machineTypeNames.get(machine.mtype) }}</span>
      <PopupWrapper>
        <template #reference>
          <font-awesome-icon class="clickable" icon="fa-solid fa-info-circle" />
        </template>
        <Popup :title="machineTypeNames.get(machine.mtype)"
          ><p>{{ machineTypeDescriptions.get(machine.mtype) }}</p></Popup
        >
      </PopupWrapper>
    </div>

    <!-- RING STATION -->
    <template v-if="machine.mtype == 'RS'">
      <p>Available rings:</p>
      <div
        v-for="ringColor in (<MachineRS>machine)['rs_ring_colors']"
        class="horizontal-flex available-ring"
      >
        <img :src="`/rings/${ringColor}.svg`" :alt="ringColor" />
        <div class="horizontal-flex">
          <font-awesome-icon icon="fa-solid fa-coins" />
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
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import type { PropType } from 'vue'
import type Machine from '@/types/Machine'
import type MachineRS from '@/types/MachineRS'
import Popup from '@/components/shared/ui/Popup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import { useMachineStore } from '@/store/machineStore'
import { storeToRefs } from 'pinia'
import {
  RING_BLUE,
  RING_GREEN,
  RING_ORANGE,
  RING_YELLOW,
} from '@/assets/exports.module.scss'

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

.available-ring {
  img {
    max-height: 40px;
    aspect-ratio: 1;
  }
}
</style>
