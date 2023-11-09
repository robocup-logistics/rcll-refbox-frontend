// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="teamsBoard">
    <div class="section">
      <div class="item" style="height: 30%">Score board</div>
      <div class="item transparent horizontal-flex grow">
        <!-- TEAM NAMES SECTION -->
        <div class="section left">
          <div class="item CYAN">
            <p>
              {{
                teamNameByColor('CYAN') ? teamNameByColor('CYAN') : 'CYAN (tbd)'
              }}
            </p>
          </div>
          <div class="item MAGENTA">
            <p>
              {{
                teamNameByColor('MAGENTA')
                  ? teamNameByColor('MAGENTA')
                  : 'MAGENTA (tbd)'
              }}
            </p>
          </div>
        </div>

        <!-- SCORES SECTION -->
        <div class="section left">
          <div class="item CYAN">
            <div class="horizontal-flex">
              <font-awesome-icon icon="fa-truck" />
              <p>{{ ordersDeliveredByTeam(teamNameByColor('CYAN')).length }}</p>
              <font-awesome-icon icon="fa-trophy" />
              <p>{{ scoreByColor('CYAN') }}</p>
              <PopupWrapper
                v-if="scoreByColor('CYAN') != 0"
                popup-position="bottom"
              >
                <template #reference>
                  <font-awesome-icon class="clickable" icon="fa-info-circle" />
                </template>
                <ScoreDetailsPopup
                  team="CYAN"
                  :teamName="teamNameByColor('CYAN')"
                  :color="cyanColor"
                >
                </ScoreDetailsPopup>
              </PopupWrapper>
            </div>
          </div>
          <div class="item MAGENTA">
            <div class="horizontal-flex">
              <font-awesome-icon icon="fa-truck" />
              <p>
                {{ ordersDeliveredByTeam(teamNameByColor('MAGENTA')).length }}
              </p>

              <font-awesome-icon icon="fa-trophy" />
              <p>{{ scoreByColor('MAGENTA') }}</p>
              <PopupWrapper
                v-if="scoreByColor('MAGENTA') != 0"
                popup-position="bottom"
              >
                <template #reference>
                  <font-awesome-icon class="clickable" icon="fa-info-circle" />
                </template>
                <ScoreDetailsPopup
                  team="MAGENTA"
                  :teamName="teamNameByColor('MAGENTA')"
                  :color="magentaColor"
                ></ScoreDetailsPopup>
              </PopupWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import ScoreDetailsPopup from '@/components/spectator/popups/ScoreDetailsPopup.vue'
import { cyanColor, magentaColor } from '@/assets/exports.module.scss'
import { useOrderStore } from '@/store/orderStore'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { teamNameByColor, scoreByColor } = storeToRefs(gameStore)

const orderStore = useOrderStore()
const { ordersDeliveredByTeam } = storeToRefs(orderStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#teamsBoard {
  display: flex;
  align-items: left;
  gap: 10px;
}
</style>
