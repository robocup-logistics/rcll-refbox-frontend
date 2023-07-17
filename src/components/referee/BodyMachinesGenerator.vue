<template>
  <div>
    <div class="row m-0 pt-2 h-100 w-100">
      <div
        v-for="(machine, index) in selectMachinesArray(color)"
        :key="index"
        :class="[machine.mtype + '-station']"
        class="col-md-12 pb-1"
      >
        <div
          class="d-flex align-content-center"
          :class="color === 'magenta' ? 'justify-content-end ms-2' : 'me-2'"
        >
          <div
            v-if="color === 'magenta'"
            class="machine-info d-flex flex-column"
          >
            <span :class="setStateClass(machine.state)">
              {{ machine.state }}
            </span>
            <!-- If RS show additional Info -->
            <div v-if="machine.mtype === 'RS'" class="d-flex my-1">
              <div class="me-2 d-flex">
                <div
                  class="rs-color-container mx-1 text-center"
                  :class="setRSandBSColor(machine['rs_ring_colors'][1])"
                >
                  <span class="lead">
                    {{ showPreparedColorInfo(machine['rs_ring_colors'][1]) }}
                  </span>
                </div>
                <div
                  class="rs-color-container ms-1 text-center"
                  :class="setRSandBSColor(machine['rs_ring_colors'][0])"
                >
                  <span class="lead">
                    {{ showPreparedColorInfo(machine['rs_ring_colors'][0]) }}
                  </span>
                </div>
              </div>
              <span class="lead">{{
                machine['bases_added'] - machine['bases_used']
              }}</span>
            </div>
            <!-- <span>{{machine.name}}</span> -->
            <div class="machine-rotation-magenta">
              <span v-if="phase === 'SETUP'"> {{ machine.rotation }}° </span>
            </div>
          </div>
          <div
            class="base-image-container"
            :class="color === 'cyan' ? 'me-1' : 'ms-1'"
          >
            <figure>
              <div
                class="station-specific-info-container text-center"
                :class="setMachineBackground(machine)"
              >
                <span class="text-active font-weight-bold text-center">{{
                  machine.name
                }}</span>
              </div>
              <figcaption
                class="text-center"
                :class="
                  color === 'cyan'
                    ? 'machine-zone-cyan'
                    : 'machine-zone-magenta'
                "
              >
                <span>{{ machine.zone }}</span>
              </figcaption>
            </figure>
          </div>
          <div v-if="color === 'cyan'" class="machine-info d-flex flex-column">
            <span :class="setStateClass(machine.state)">
              {{ machine.state }}
            </span>
            <!-- If RS show additional Info -->
            <div v-if="machine.mtype === 'RS'" class="d-flex my-1">
              <span class="lead">{{
                machine['bases_added'] - machine['bases_used']
              }}</span>
              <div class="ms-2 d-flex">
                <div
                  class="rs-color-container me-1 text-center"
                  :class="setRSandBSColor(machine['rs_ring_colors'][0])"
                >
                  <span class="lead">
                    {{ showPreparedColorInfo(machine['rs_ring_colors'][0]) }}
                  </span>
                </div>
                <div
                  class="rs-color-container mx-1 text-center"
                  :class="setRSandBSColor(machine['rs_ring_colors'][1])"
                >
                  <span class="lead">
                    {{ showPreparedColorInfo(machine['rs_ring_colors'][1]) }}
                  </span>
                </div>
              </div>
            </div>
            <!-- <span>{{machine.name}}</span> -->
            <div class="machine-rotation-cyan">
              <span v-if="phase === 'SETUP'"> {{ machine.rotation }}° </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import { useMachineStore } from '@/store/machineStore'

defineProps({
  color: {
    type: String,
    required: true,
  },
})

const mainStore = useMainStore()
const machineStore = useMachineStore()
const { phase } = storeToRefs(mainStore)
const { machinesCyan, machinesMagenta, ringspecs } = storeToRefs(machineStore)

function selectMachinesArray(teamColor: string) {
  if (teamColor === 'cyan') {
    return machinesCyan.value
  } else {
    return machinesMagenta.value
  }
}

// set classname depending on the state of the machine
function setStateClass(state: string) {
  let classList = ''
  if (state === 'IDLE' || state === 'WAIT-IDLE') {
    classList += 'machine-state-large text-light lead'
  } else if (state === 'BROKEN' || state === 'DOWN') {
    classList += 'machine-state-small text-danger lead '
  } else {
    classList += 'machine-state-small text-warning lead'
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

function setMachineBackground(machine) {
  if (machine.mtype === 'RS') {
    return setRSandBSColor(machine['rs_ring_color'])
  } else if (machine.mtype === 'BS') {
    return setRSandBSColor(machine['bs_color'])
  }
}

defineExpose({
  phase,
  selectMachinesArray,
  setStateClass,
  showPreparedColorInfo,
  setRSandBSColor,
  setMachineBackground,
})
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';

figcaption {
  font-size: 12px;
}

.machine-zone-cyan {
  color: global.$main-cyan-color;
}

.machine-zone-magenta {
  color: global.$main-magenta-color;
}

.machine-state-small {
  font-size: 12px;
}

.machine-state-large {
  font-size: 15px;
}

.machine-info {
  line-height: 1 !important;
}

.machine-rotation-cyan {
  color: global.$main-cyan-color;
}

.machine-rotation-magenta {
  color: global.$main-magenta-color;
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

.rs-color-container {
  width: 20px;
  border-radius: 5px;
}

.station-specific-info-container {
  width: 50px;
  height: 25px;
  border: 1px solid black !important;
}
</style>
