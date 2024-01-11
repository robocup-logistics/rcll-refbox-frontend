// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion title="Score" id="scoreBoard">
    <div class="vertical-flex">
      <div class="item transparent horizontal-flex">
        <!-- TEAM NAMES SECTION -->
        <div class="vertical-flex left">
          <div class="item transparent">
            <p class="team-name">
              {{ teamNameByColor('CYAN') }}
            </p>
          </div>
          <div class="item transparent">
            <p class="team-name">
              {{ teamNameByColor('MAGENTA') }}
            </p>
          </div>
        </div>

        <!-- SCORES SECTION -->
        <div class="vertical-flex left">
          <div class="item CYAN">
            <PopupWrapper popup-position="bottom" class="team-score">
              <template #reference>
                <div class="horizontal-flex">
                  <font-awesome-icon icon="fa-truck" />
                  <p>
                    {{ ordersDeliveredByTeam(teamNameByColor('CYAN')).length }}
                  </p>
                  <font-awesome-icon icon="fa-trophy" />
                  <p>{{ scoreByColor('CYAN') }}</p>
                  <font-awesome-icon icon="fa-info-circle" />
                </div>
              </template>
              <ScoreDetailsPopup
                team="CYAN"
                :teamName="teamNameByColor('CYAN')"
                :color="cyanColor"
              >
              </ScoreDetailsPopup>
            </PopupWrapper>
          </div>
          <div class="item MAGENTA">
            <PopupWrapper popup-position="bottom" class="team-score">
              <template #reference>
                <div class="horizontal-flex team-score">
                  <font-awesome-icon icon="fa-truck" />
                  <p>
                    {{
                      ordersDeliveredByTeam(teamNameByColor('MAGENTA')).length
                    }}
                  </p>

                  <font-awesome-icon icon="fa-trophy" />
                  <p>{{ scoreByColor('MAGENTA') }}</p>
                  <font-awesome-icon icon="fa-info-circle" />
                </div>
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
  </Accordion>
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
import Accordion from '@/components/shared/ui/Accordion.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { teamNameByColor, scoreByColor } = storeToRefs(gameStore)

const orderStore = useOrderStore()
const { ordersDeliveredByTeam } = storeToRefs(orderStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#scoreBoard {
  .team-name {
    white-space: nowrap;
    align-self: flex-end;
  }

  .team-score {
    align-self: flex-start;
    text-align: left;
  }
}
</style>
