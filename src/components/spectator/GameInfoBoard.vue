// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion horizontal title="Game" expanded-default id="gameInfoBoard">
    <div class="vertical-flex">
      <div class="flex-item transparent">
        <div class="horizontal-flex phase-bar">
          <!-- PRE GAME -->
          <div :class="['arrow', { active: phase == 'PRE_GAME' }]">
            <div class="vertical-flex center">
              <font-awesome-icon icon="fa-clock" />
            </div>

            <div class="after"></div>
          </div>
          <!-- SETUP -->
          <div :class="['arrow', { active: phase == 'SETUP' }]">
            <div class="before"></div>
            <PopupWrapper popup-position="bottom">
              <template #reference>
                <div class="vertical-flex center">
                  <div class="horizontal-flex">
                    <span>Setup</span>
                    <font-awesome-icon icon="fa-info-circle" />
                  </div>
                  <p v-if="phase == 'SETUP'">
                    {{ formatTime(game_time) }}
                  </p>
                </div>
              </template>
              <SetupPhasePopup />
            </PopupWrapper>
            <div class="after"></div>
          </div>
          <!-- PRODUCTION (NOT OVERTIME) -->
          <div
            :class="[
              'arrow',
              {
                active:
                  phase == 'PRODUCTION' && game_time <= PRODUCTION_DURATION,
              },
            ]"
          >
            <div class="before"></div>
            <PopupWrapper popup-position="bottom">
              <template #reference>
                <div class="vertical-flex center">
                  <div class="horizontal-flex">
                    <span>Production</span>
                    <font-awesome-icon icon="fa-info-circle" />
                  </div>

                  <p v-if="phase == 'PRODUCTION' && !overtime">
                    {{ formatTime(game_time) }}
                  </p>
                </div>
              </template>
              <ProductionPhasePopup />
            </PopupWrapper>
            <div class="after"></div>
          </div>

          <!-- PRODUCTION (OVERTIME) -->
          <div
            v-if="overtime == true"
            :class="[
              'arrow',
              {
                active:
                  phase == 'PRODUCTION' && game_time > PRODUCTION_DURATION,
              },
            ]"
          >
            <div class="before"></div>
            <PopupWrapper popup-position="bottom">
              <template #reference>
                <div class="vertical-flex center">
                  <div class="horizontal-flex">
                    Overtime
                    <font-awesome-icon icon="fa-info-circle" />
                  </div>
                  <p v-if="phase == 'PRODUCTION' && overtime">
                    {{ formatTime(game_time) }}
                  </p>
                </div>
              </template>
              <OvertimePopup />
            </PopupWrapper>
            <div class="after"></div>
          </div>
          <!-- POST GAME -->
          <div :class="['arrow', { active: phase == 'POST_GAME' }]">
            <div class="before"></div>
            <div class="vertical-flex center">
              <font-awesome-icon icon="fa-flag-checkered" />
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM BANNER ... -->
      <div class="flex-item transparent">
        <div class="horizontal-flex">
          <!-- ... FOR SOCKET MODE ... -->
          <template v-if="currentMode == 'socket'">
            <!-- ... AND CONNECTED -->
            <template v-if="socket">
              <font-awesome-icon icon="fa-circle" class="text-success" />
              <span class="text-success">Live</span>

              <span v-if="phase == 'PRE_GAME'"> • Waiting for game start </span>
              <span v-if="phase == 'SETUP'">
                •
                {{ formatTime(SETUP_DURATION - game_time) }} until
                <ProductionPhaseExplainable />
              </span>
              <span v-if="phase == 'PRODUCTION' && !overtime">
                • {{ formatTime(PRODUCTION_DURATION - game_time) }} remaining
              </span>
              <span v-if="phase == 'PRODUCTION' && overtime">
                •
                {{
                  formatTime(
                    PRODUCTION_DURATION + OVERTIME_DURATION - game_time,
                  )
                }}
                remaining
              </span>
              <div
                v-if="
                  state == 'PAUSED' && ['SETUP', 'PRODUCTION'].includes(phase)
                "
                class="horizontal-flex"
              >
                <span>•</span>
                <font-awesome-icon icon="fa-pause" class="text-warning" />
                <span class="text-warning">PAUSED</span>
              </div>
            </template>
            <!-- ... AND NOT CURRENTLY CONNECTED -->
            <template v-else>
              <font-awesome-icon
                icon="fa-unlink"
                class="text-danger"
                style="flex-shrink: 0"
              />
              <span class="text-danger" style="flex-shrink: 0"
                >Disconnected</span
              >
              <ConnectToWebsocket />
            </template>
          </template>
          <!-- ... FOR GAME REPORT MODE -->
          <template v-else-if="currentMode == 'gameReport' && gameReport">
            <div class="horizontal-flex">
              <PillButton
                :description="state == 'RUNNING' ? 'Pause' : 'Run'"
                :title="state == 'RUNNING' ? 'Pause game' : 'Run game'"
                @click="toggleState"
              >
                <font-awesome-icon
                  :icon="state == 'RUNNING' ? 'fa-pause' : 'fa-play'"
                />
              </PillButton>
              <PopupWrapper popup-position="bottom">
                <template #reference>
                  <PillButton description="Speed" title="Toggle speed">
                    {{ gameSpeed }}x
                  </PillButton>
                </template>
                <GameSpeedPopup />
              </PopupWrapper>

              <PopupWrapper popup-position="bottom">
                <template #reference>
                  <PillButton description="Jump" title="Set time">
                    <font-awesome-icon icon="fa-timeline" />
                  </PillButton>
                </template>
                <TimelinePopup />
              </PopupWrapper>
              <div>•</div>
              <div class="vertical-flex">
                <div class="horizontal-flex">
                  <font-awesome-icon icon="fa-folder-open" />
                  <div>
                    {{
                      gameReport.report_name.length
                        ? gameReport.report_name.length
                        : 'Unnamed game'
                    }}
                  </div>
                </div>
                <div class="text-subtle">
                  {{ new Date(gameReport.start_time).toLocaleString() }}
                </div>
              </div>
            </div>
            <p></p>
          </template>
        </div>
      </div>
    </div>
  </Accordion>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useReportStore } from '@/store/reportStore'
import formatTime from '@/utils/formatTime'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import SetupPhasePopup from '@/components/spectator/popups/SetupPhasePopup.vue'
import ProductionPhasePopup from '@/components/spectator/popups/ProductionPhasePopup.vue'
import OvertimePopup from '@/components/spectator/popups/OvertimePopup.vue'
import { useSocketStore } from '@/store/socketStore'
import Accordion from '@/components/shared/ui/Accordion.vue'
import PillButton from '@/components/shared/ui/PillButton.vue'
import ProductionPhaseExplainable from '@/components/spectator/explainables/ProductionPhaseExplainable.vue'
import GameSpeedPopup from '@/components/spectator/popups/GameSpeedPopup.vue'
import TimelinePopup from '@/components/spectator/popups/TimelinePopup.vue'
import { useAppStore } from '@/store/appStore'
import ConnectToWebsocket from '@/components/shared/util/ConnectToWebsocket.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const socketStore = useSocketStore()
const { socket } = storeToRefs(socketStore)
const gameStore = useGameStore()
const {
  phase,
  state,
  game_time,
  overtime,
  SETUP_DURATION,
  PRODUCTION_DURATION,
  OVERTIME_DURATION,
} = storeToRefs(gameStore)
const reportStore = useReportStore()
const { gameReport, gameSpeed } = storeToRefs(reportStore)
const appStore = useAppStore()
const { currentMode } = storeToRefs(appStore)

// game progress - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

// report  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> run/pause
function toggleState() {
  if (state.value == 'WAIT_START' || state.value == 'PAUSED') {
    reportStore.runGame()
  } else if (state.value == 'RUNNING') {
    state.value = 'PAUSED'
  }
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#gameInfoBoard {
  .phase-bar {
    $arrowWidth: 15px;
    $bgColor: global.$surfaceColor;
    $neutralColor: global.$lighterColor;
    $activeColor: global.$accentColor;
    $activeColorDarker: global.$accentColorDarker;
    flex-grow: 1;
    gap: 0 !important;

    .arrow {
      height: 100%;
      display: flex;
      padding: 0 $arrowWidth;
      background-color: $neutralColor;
      align-items: stretch;

      &:first-child {
        border-radius: 8px 0 0 8px;
      }

      &:last-child {
        border-radius: 0 8px 8px 0;
      }

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
