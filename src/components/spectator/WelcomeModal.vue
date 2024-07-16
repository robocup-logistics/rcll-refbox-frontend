// TEMPLATE --------------------------------------------------------------------
<template>
  <Modal
    v-if="!advancedOptions"
    title="Welcome"
    icon="fa-face-smile"
    ref="modal"
  >
    <div class="step-chooser">
      <div class="step-item" v-for="i in numberOfSteps" :key="i">
        <button
          :class="['step-item-box', step == i ? 'active' : '']"
          @click="step = i"
          :disabled="step < i"
        >
          {{ i }}
        </button>
      </div>
    </div>
    <template v-if="step == 1">
      <p>
        <span>
          This is the official interactive web frontend for the RoboCup
          Logistics League. If you are not familiar with the rules of this
          competition, we tried our best to explain them to you in the next few
          steps. You also find some additional help throughout this app in the
          form of
        </span>
        <ExplainablesExplainable></ExplainablesExplainable>.
      </p>
    </template>
    <template v-else-if="step == 2">
      <p>
        <span>
          Let's get you familiar with the basic idea: Two competing teams, a
          cyan and a magenta team, try to submit a number of
        </span>
        orders
        <span> . In order to deliver these orders </span>
        robots
        <span>
          of the team have to first assemble them by executing a number of tasks
          at different
        </span>
        machines
        <span> . </span>
      </p>
    </template>
    <template v-else-if="step == 3">
      <p>
        There are five different types of machines. The centrepiece of each is a
        conveyor belt. Apart from the delivery station, each conveyor belt has
        an input side (marked blue) and an output side.
      </p>
      <div class="machines-grid">
        <div class="content-box">
          <img src="/machines/machine-BS.svg" />
          <BaseStationExplainable />
        </div>
        <div class="content-box">
          <img src="/machines/machine-RS-RING_BLUE,RING_YELLOW.svg" />
          <RingStationExplainable />
        </div>
        <div class="content-box">
          <img src="/machines/machine-CS-CAP_GREY.svg" />
          <CapStationExplainable />
        </div>
        <div class="content-box">
          <img src="/machines/machine-DS.svg" />
          <DeliveryStationExplainable />
        </div>
        <div class="content-box">
          <img src="/machines/machine-SS.svg" />
          <StorageStationExplainable />
        </div>
      </div>
      <p>
        While many actions at different machines score the teams points, most
        points can be earned by delivering products and thus fulfilling orders.
      </p>
    </template>
    <template v-else-if="step == 4">
      <p>Finally, the game is divided into seperate phases:</p>
      <p>
        <span> First, there is the </span>
        <SetupPhaseExplainable />
        <span>
          which lasts for {{ formatTime(SETUP_DURATION) }} minutes. It is
          followed by the
        </span>
        <ProductionPhaseExplainable />
        <span> lasting for {{ formatTime(PRODUCTION_DURATION) }} minutes.</span>
      </p>
      <p>
        <span>In case of a tie, an additional </span>
        <OvertimeExplainable />
        <span>
          with a maximum duration of {{ formatTime(OVERTIME_DURATION) }} minutes
          takes place.
        </span>
      </p>
    </template>
    <div
      class="horizontal-flex"
      v-shortkey="(shortcuts.get('dismissPopup') as Shortcut).keys"
      @shortkey.native="close"
    >
      <Button v-if="step < numberOfSteps" icon="fa-forward" @click="close()">
        Skip introduction
      </Button>
      <div style="flex-grow: 1"></div>
      <Button
        v-if="step < numberOfSteps"
        primary
        icon="fa-chevron-right"
        @click="step += 1"
      >
        Next step
      </Button>
      <Button v-else primary icon="fa-check" @click="close()">Finish</Button>
    </div>
  </Modal>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, type Ref } from 'vue'
import Modal from '@/components/shared/ui/Modal.vue'
import Button from '@/components/shared/ui/Button.vue'
import ExplainablesExplainable from '@/components/spectator/explainables/ExplainablesExplainable.vue'
import { useGameStore } from '@/store/gameStore'
import { storeToRefs } from 'pinia'
import SetupPhaseExplainable from '@/components/spectator/explainables/SetupPhaseExplainable.vue'
import ProductionPhaseExplainable from '@/components/spectator/explainables/ProductionPhaseExplainable.vue'
import OvertimeExplainable from '@/components/spectator/explainables/OvertimeExplainable.vue'
import formatTime from '@/utils/formatTime'
import BaseStationExplainable from '@/components/spectator/explainables/BaseStationExplainable.vue'
import CapStationExplainable from '@/components/spectator/explainables/CapStationExplainable.vue'
import DeliveryStationExplainable from '@/components/spectator/explainables/DeliveryStationExplainable.vue'
import RingStationExplainable from '@/components/spectator/explainables/RingStationExplainable.vue'
import StorageStationExplainable from '@/components/spectator/explainables/StorageStationExplainable.vue'
import type Shortcut from '@/types/Shortcut'
import { useKeyboardStore } from '@/store/keyboardStore'
import { useAppStore } from '@/store/appStore'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { SETUP_DURATION, PRODUCTION_DURATION, OVERTIME_DURATION } =
  storeToRefs(gameStore)
const keyboardStore = useKeyboardStore()
const { shortcuts } = storeToRefs(keyboardStore)
const appStore = useAppStore()
const { advancedOptions, currentView } = storeToRefs(appStore)

// current step  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const step: Ref<number> = ref(1)
const numberOfSteps: number = 4

// modal - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const modal: Ref<typeof Modal | null> = ref(null)
function close() {
  if (modal.value) modal.value.close()
}
</script>

// STYLE -----------------------------------------------------------------------
<style lang="scss" scoped>
@use '@/assets/global.scss';

.step-chooser {
  margin-bottom: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;

  .step-item {
    width: 100%;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      background-color: global.$lighterColor;
      top: 14px;
      right: -50%;
    }

    &:last-child {
      &:after {
        content: none;
      }
    }

    .step-item-box {
      width: 30px;
      height: 30px;

      display: block;
      margin: 0 auto;
      z-index: 200;
      position: absolute;
      right: 0;
      left: 0;

      border-radius: 50%;
      text-align: center;
      background-color: global.$lighterColor;
      color: black;

      &.active {
        background-color: global.$accentColor;
      }

      &:hover:enabled {
        cursor: pointer;
      }

      &:disabled {
        color: global.$lighterColor;
      }
    }
  }
}

.machines-grid {
  overflow: hidden;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;

  img {
    height: 80px;
  }
}
</style>
