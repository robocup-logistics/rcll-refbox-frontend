<template>
  <div
    :class="['item', 'machines-container', color == 'MAGENTA' ? 'rtl' : '']"
  >
        <div style="display: grid; grid-template-columns: 55px 1fr; gap: 20px;" >
          <template
            v-for="(machine, index) in machinesByColor(color)"
            :key="index"
          >
            <div class="machine-left">
              <div :class="setMachineBackground(machine)">
                <span>{{ machine.name }}</span>
              </div>
              <div :class="['machine-pos', `${color}-text`]">
                <span>{{ machine.zone }}</span>
              </div>
            </div>
        
            <div class="machine-right">
              <span :class="['machine-state', setStateClass(machine.state)]">
                {{ machine.state }}
              </span>
              <!-- If RS show additional Info -->
              <div v-if="machine.mtype === 'RS'" class="horizontal-flex">
                  <div
                    class="rs-color-container"
                    :class="setRSandBSColor((<MachineRS>machine)['rs_ring_colors'][1])"
                  >
                    <span>
                      {{ showPreparedColorInfo((<MachineRS>machine)['rs_ring_colors'][1]) }}
                    </span>
                  </div>
                  <div
                    class="rs-color-container"
                    :class="setRSandBSColor((<MachineRS>machine)['rs_ring_colors'][0])"
                  >
                    <span>
                      {{ showPreparedColorInfo((<MachineRS>machine)['rs_ring_colors'][0]) }}
                    </span>
                  </div>
      
                <span>{{
                  (<MachineRS>machine)['bases_added'] - (<MachineRS>machine)['bases_used']
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

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import type Machine from '@/types/Machine'
import MachineRS from '@/types/MachineRS';
import MachineBS from '@/types/MachineBS';
import { PropType } from 'vue';
import Color from '@/types/Color';

defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

const gameStore = useGameStore()
const machineStore = useMachineStore()
const { phase } = storeToRefs(gameStore)
const { ringspecs, machinesByColor } = storeToRefs(machineStore)

// set classname depending on the state of the machine
function setStateClass(state: string) {
  let classList = ''
  if (state === 'READY-AT-OUTPUT' || state === 'PROCESSING') {
    classList += 'text-warning'
  } else   if (state === 'BROKEN' || state === 'DOWN') {
    classList += 'text-danger '
  }
  return classList
}

// display how much bases the ring needs
function showPreparedColorInfo(ringColor: string) {
  let reqBases = 0
  ringspecs.value.forEach((ringspec) => {
    if (ringspec.color === ringColor) {
      reqBases = ringspec['req_bases']
    }
  })
  return `${reqBases}`
}

// sets background color depending on the ringcolor and BS-Color
function setRSandBSColor(color: string) {
  if (color === 'RING_BLUE') {
    return 'bg-blue'
  } else if (color === 'RING_ORANGE') {
    return 'bg-orange'
  } else if (color === 'RING_GREEN') {
    return 'bg-green'
  } else if (color === 'RING_YELLOW') {
    return 'bg-yellow'
  } else if (color === 'BASE_SILVER') {
    return 'bg-silver'
  } else if (color === 'BASE_RED') {
    return 'bg-red'
  } else if (color === 'BASE_BLACK') {
    return 'bg-black'
  }
}

function setMachineBackground(machine: Machine) {
  if (machine.mtype === 'RS') {
    return setRSandBSColor((<MachineRS>machine)['rs_ring_color'])
  } else if (machine.mtype === 'BS') {
    return setRSandBSColor((<MachineBS>machine)['bs_color'])
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';

.machines-container {
  width: 100%;
  height: 100%;
  text-align: start;
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
      border-radius: 5px;
    }
  }
}

.bg-black {
  background-color: black !important;
}
.bg-red {
  background-color: rgb(228, 44, 44) !important;
}
.bg-orange {
  background-color: orangered !important;
}
.bg-green {
  background-color: green;
}
.bg-blue {
  background-color: rgba(0, 0, 255, 0.651) !important;
}
.bg-yellow {
  background-color: rgba(255, 255, 0, 0.685) !important;
}
.bg-silver {
  background-color: silver !important;
}
</style>
