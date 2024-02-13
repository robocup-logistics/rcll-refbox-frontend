// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="flex-item transparent game-info">
    <div class="horizontal-flex phase-bar">
      <!-- PRE GAME -->
      <div
        :class="['arrow', 'clickable', { active: phase == 'PRE_GAME' }]"
        @click="handlePhaseClick('PRE_GAME')"
      >
        <div v-if="phase == 'PRE_GAME'">
          <font-awesome-icon icon="fa-play" />
          <p>Start game</p>
        </div>
        <font-awesome-icon v-else icon="fa-clock" />

        <div class="after"></div>
      </div>
      <!-- SETUP -->
      <div
        :class="['arrow', 'clickable', { active: phase == 'SETUP' }]"
        @click="handlePhaseClick('SETUP')"
      >
        <div class="before"></div>

        <div class="flex-item transparent">
          <p>Setup</p>
          <div v-if="phase == 'SETUP'" class="horizontal-flex">
            <span>
              {{ formatTime(game_time) }}
            </span>
            <template v-if="state == 'RUNNING'">
              <font-awesome-icon icon="fa-pause" />
            </template>
            <template v-else>
              <span> (PAUSED) </span>
              <font-awesome-icon icon="fa-play" />
            </template>
          </div>
        </div>

        <div class="after"></div>
      </div>
      <!-- PRODUCTION -->
      <div
        :class="[
          'arrow',
          'clickable',
          {
            active: phase == 'PRODUCTION',
          },
        ]"
        @click="handlePhaseClick('PRODUCTION')"
      >
        <div class="before"></div>

        <div class="flex-item transparent">
          <p>Production</p>
          <div v-if="phase == 'PRODUCTION'" class="horizontal-flex">
            <span>
              {{ formatTime(game_time) }}
            </span>
            <template v-if="state == 'RUNNING'">
              <font-awesome-icon icon="fa-pause" />
            </template>
            <template v-else>
              <span> (PAUSED) </span>
              <font-awesome-icon icon="fa-play" />
            </template>
          </div>
        </div>

        <div class="after"></div>
      </div>
      <!-- POST GAME -->
      <div
        :class="['arrow', 'clickable', { active: phase == 'POST_GAME' }]"
        @click="handlePhaseClick('POST_GAME')"
      >
        <div class="before"></div>
        <font-awesome-icon icon="fa-flag-checkered" />
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import formatTime from '@/utils/formatTime'
import { useGameStore } from '@/store/gameStore'
import Phase from '@/types/Phase'
import { ComputedRef, computed } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { phase, state, game_time, SETUP_DURATION, PRODUCTION_DURATION } =
  storeToRefs(gameStore)

// display progress  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const progress: ComputedRef<string> = computed(() => {
  function floatToPercentageString(progress: number): string {
    return Math.round(progress * 100).toString() + '%'
  }
  if (phase.value == 'SETUP') {
    return floatToPercentageString(game_time.value / SETUP_DURATION.value)
  } else if (phase.value == 'PRODUCTION') {
    return floatToPercentageString(game_time.value / PRODUCTION_DURATION.value)
  } else {
    return '100%'
  }
})

// react to click on phase  - - - - - - -  - - - - - - - - - - - - - - - - - - -
// if the referee clicked on the current phase we want the game to pause, else
// we want to switch the phase to the selected one (and also set the state to
// RUNNING)
function handlePhaseClick(newPhase: Phase) {
  if (newPhase == phase.value) {
    gameStore.sendSetGamestate(state.value == 'RUNNING' ? 'PAUSED' : 'RUNNING')
  } else {
    gameStore.sendSetPhase(newPhase)
    gameStore.sendSetGamestate('RUNNING')
  }
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.game-info {
  min-width: fit-content;
  max-width: fit-content;

  .phase-bar {
    $arrowWidth: 15px;
    $bgColor: global.$bgColor;
    $neutralColor: global.$surfaceColor;
    $activeColor: global.$accentColor;
    $activeColorDarker: global.$accentColorDarker;
    flex-grow: 1;
    gap: 0 !important;

    .arrow {
      height: 100%;
      display: flex;
      padding: 0 $arrowWidth;
      background-color: $neutralColor;
      align-items: center;

      .before,
      .after {
        position: relative;
        height: 100%;
        width: $arrowWidth;
      }

      .before:before,
      .before:after,
      .after:before,
      .after:after {
        width: $arrowWidth;
        height: 50%;
        position: absolute;
        content: '';
      }

      .before:before,
      .before:after {
        right: 100%;
      }

      .after:before,
      .after:after {
        left: 100%;
      }

      .before:before {
        top: 0px;
        background: linear-gradient(
          to right top,
          $bgColor 50%,
          transparent 50%
        );
      }

      .before:after {
        top: 50%;
        background: linear-gradient(
          to right bottom,
          $bgColor 50%,
          transparent 50%
        );
      }

      .after:before {
        top: 0px;
        background: linear-gradient(
          to left bottom,
          $bgColor 50%,
          transparent 50%
        );
      }

      .after:after {
        top: 50%;
        background: linear-gradient(to left top, $bgColor 50%, transparent 50%);
      }

      &.active {
        background-color: $activeColorDarker;
        width: 100%;
        background-image: linear-gradient(
          90deg,
          $activeColor v-bind('progress'),
          transparent v-bind('progress'),
          transparent
        );
      }
    }
  }
}
</style>
