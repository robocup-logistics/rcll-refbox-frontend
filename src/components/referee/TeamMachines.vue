// TEMPLATE --------------------------------------------------------------------
<template>
  <div
    :class="[
      'flex-item',
      'machines-container',
      'darker',
      color == 'MAGENTA' ? 'rtl' : '',
    ]"
  >
    <div style="display: grid; grid-template-columns: 55px 1fr; gap: 20px">
      <template v-for="machine in machinesByColor(color)">
        <div class="machine-left">
          <div
            :class="[
              machine.mtype === 'RS' && machine.current_ring_color
                ? machine.current_ring_color
                : machine.mtype === 'BS' && machine.current_base_color
                ? machine.current_base_color
                : '',
            ]"
          >
            <span>{{ machine.name }}</span>
          </div>
          <div :class="['machine-pos', `${color}-text`]">
            <span>{{ machine.zone }}</span>
          </div>
        </div>

        <div class="machine-right">
          <span
            :class="[
              'machine-state',
              machine.state === 'READY-AT-OUTPUT' ||
              machine.state === 'PROCESSING'
                ? 'text-warning'
                : machine.state === 'BROKEN' || machine.state === 'DOWN'
                ? 'text-danger'
                : '',
            ]"
          >
            {{ machine.state }}
          </span>
          <!-- If RS show additional Info -->
          <div v-if="machine.mtype === 'RS'" class="horizontal-flex">
            <div
              class="rs-color-container"
              :class="['rs-color-container', machine['available_colors'][1]]"
            >
              <span>
                {{ ringColorCost(machine.available_colors[1]) }}
              </span>
            </div>
            <div
              :class="['rs-color-container', machine['available_colors'][0]]"
            >
              <span>
                {{ ringColorCost(machine.available_colors[0]) }}
              </span>
            </div>

            <span v-if="machine.bases_added && machine.bases_used">{{
              machine.bases_added - machine.bases_used
            }}</span>
          </div>
          <div :class="`${color}-text`">
            <span v-if="phase === 'SETUP'"> {{ machine.rotation }}° </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import { ComputedRef, PropType, computed } from 'vue'
import Color from '@/types/Color'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const machineStore = useMachineStore()
const { phase } = storeToRefs(gameStore)
const { ringSpecs, machinesByColor } = storeToRefs(machineStore)

// get ring color cost - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const ringColorCost: ComputedRef<(ringColor: string) => number> = computed(
  () => {
    return (ringColor: string) => {
      const ringSpec = ringSpecs.value.find(
        (ringspec) => ringspec.color === ringColor
      )
      if (ringSpec) {
        return ringSpec.req_bases
      } else {
        return 0
      }
    }
  }
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.machines-container {
  width: 100%;
  height: 100%;
  text-align: start !important;
  align-items: start !important;
  padding: 10px !important;

  &.rtl {
    direction: rtl !important;
  }

  .machine-left {
    .machine-pos {
      font-size: 0.8rem;
    }
  }

  .machine-right {
    line-height: 1 !important;

    .machine-state {
      font-size: 15px;
    }

    .rs-color-container {
      text-align: center;
      width: 20px;
      border-radius: 8px;
    }
  }
}

.BASE_BLACK {
  background-color: black !important;
}
.BASE_RED {
  background-color: rgb(228, 44, 44) !important;
}
.BASE_SILVER {
  background-color: silver !important;
}
.RING_ORANGE {
  background-color: orangered !important;
}
.RING_GREEN {
  background-color: green;
}
.RING_BLUE {
  background-color: rgba(0, 0, 255, 0.651) !important;
}
.RING_YELLOW {
  background-color: rgba(255, 255, 0, 0.685) !important;
}
</style>
