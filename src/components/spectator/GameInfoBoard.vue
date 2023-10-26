// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="gameInfoBoard">
    <div class="section">
      <!-- TOP PHASE DISPLAY -->
      <div class="item transparent">
        <div class="horizontal-flex phase-bar">
          <!-- PRE GAME -->
          <div :class="['arrow', { active: phase == 'PRE_GAME' }]">
            <font-awesome-icon icon="fa-solid fa-clock" />
            <div class="after"></div>
          </div>
          <!-- SETUP -->
          <div :class="['arrow', { active: phase == 'SETUP' }]">
            <div class="before"></div>
            <div class="item transparent">
              <div class="horizontal-flex">
                <span>Setup</span>
                <PopupWrapper popup-position="bottom">
                  <template #reference>
                    <font-awesome-icon
                      class="clickable"
                      icon="fa-solid fa-info-circle"
                    />
                  </template>
                  <Popup title="Setup phase">
                    <p>
                      Duration:
                      {{ formatTime(SETUP_DURATION) }} minutes
                    </p>
                  </Popup>
                </PopupWrapper>
              </div>
              <div v-if="phase == 'SETUP'">
                <span>
                  {{ formatTime(SETUP_DURATION - gametime) }}
                </span>
                <span v-if="gamestate == 'PAUSED'"> (PAUSED) </span>
              </div>
            </div>
            <div class="after"></div>
          </div>
          <!-- PRODUCTION (NOT OVERTIME) -->
          <div
            :class="[
              'arrow',
              {
                active:
                  phase == 'PRODUCTION' && gametime <= PRODUCTION_DURATION,
              },
            ]"
          >
            <div class="before"></div>
            <div class="item transparent">
              <div class="horizontal-flex">
                <span>Production</span>
                <PopupWrapper popup-position="bottom">
                  <template #reference>
                    <font-awesome-icon
                      class="clickable"
                      icon="fa-solid fa-info-circle"
                    />
                  </template>
                  <Popup title="Production phase">
                    <p>
                      Duration:
                      {{ formatTime(PRODUCTION_DURATION) }} minutes
                    </p>
                  </Popup>
                </PopupWrapper>
              </div>
              <div v-if="phase == 'PRODUCTION' && !overtime">
                <span>
                  {{ formatTime(PRODUCTION_DURATION - gametime) }}
                </span>
                <span v-if="gamestate == 'PAUSED'"> (PAUSED) </span>
              </div>
            </div>
            <div class="after"></div>
          </div>
          <!-- PRODUCTION (OVERTIME) -->
          <div
            v-if="overtime == true"
            :class="[
              'arrow',
              {
                active: phase == 'PRODUCTION' && gametime > PRODUCTION_DURATION,
              },
            ]"
          >
            <div class="before"></div>
            <div class="item transparent">
              <div class="horizontal-flex">
                Overtime
                <PopupWrapper popup-position="bottom">
                  <template #reference>
                    <font-awesome-icon
                      class="clickable"
                      icon="fa-solid fa-info-circle"
                    />
                  </template>
                  <OvertimePopup></OvertimePopup>
                </PopupWrapper>
              </div>
              <div v-if="phase == 'PRODUCTION' && overtime">
                <span>
                  {{
                    formatTime(
                      PRODUCTION_DURATION + OVERTIME_DURATION - gametime
                    )
                  }}
                </span>
                <span v-if="gamestate == 'PAUSED'"> (PAUSED) </span>
              </div>
            </div>
            <div class="after"></div>
          </div>
          <!-- POST GAME -->
          <div :class="['arrow', { active: phase == 'POST_GAME' }]">
            <div class="before"></div>
            <font-awesome-icon icon="fa-solid fa-flag-checkered" />
          </div>
        </div>
      </div>
      <!-- BOTTOM BANNER -->
      <div
        :class="[
          'item',
          {
            CYAN: phase == 'POST_GAME' && winner == teamNameByColor('CYAN'),
            MAGENTA:
              phase == 'POST_GAME' && winner == teamNameByColor('MAGENTA'),
          },
        ]"
      >
        <div class="horizontal-flex" style="font-size: 20px">
          <!-- PRE GAME: STATIC TEXT -->
          <template v-if="phase == 'PRE_GAME'">
            The game will start soon!
          </template>
          <!-- POST GAME: WINNER -->
          <template v-else-if="phase == 'POST_GAME'">
            <font-awesome-icon icon="fa-solid fa-trophy" />
            <p v-html="winnerText"></p>
          </template>
          <template v-else>
            <p>What's happening placeholder</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useRuleStore } from '@/store/ruleStore'
import formatTime from '@/utils/formatTime'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import Popup from '@/components/shared/ui/Popup.vue'
import OvertimePopup from '@/components/spectator/popups/OvertimePopup.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { phase, gamestate, gametime, overtime, teamNameByColor, scoreByColor } =
  storeToRefs(gameStore)
const ruleStore = useRuleStore()
const { SETUP_DURATION, PRODUCTION_DURATION, OVERTIME_DURATION } =
  storeToRefs(ruleStore)

// progress  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const progress: ComputedRef<string> = computed(() => {
  function floatToPercentageString(progress: number): string {
    return Math.round(progress * 100).toString() + '%'
  }
  if (phase.value == 'SETUP') {
    return floatToPercentageString(gametime.value / SETUP_DURATION.value)
  } else if (phase.value == 'PRODUCTION') {
    return floatToPercentageString(gametime.value / PRODUCTION_DURATION.value)
  } else {
    return '100%'
  }
})

// winner  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const winner: ComputedRef<string | undefined> = computed(() => {
  if (scoreByColor.value('CYAN') > scoreByColor.value('MAGENTA')) {
    return teamNameByColor.value('CYAN')
  } else if (scoreByColor.value('MAGENTA') > scoreByColor.value('CYAN')) {
    return teamNameByColor.value('MAGENTA')
  }
})

const winnerText: ComputedRef<string> = computed(() => {
  if (winner.value) {
    return `<span>${winner.value}</span> has won`
  } else {
    return 'The game has ended with a DRAW'
  }
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#gameInfoBoard {
  height: 100%;

  .phase-bar {
    $arrowWidth: 15px;
    $bgColor: global.$bgColorDarker;
    $neutralColor: global.$bgColor;
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
