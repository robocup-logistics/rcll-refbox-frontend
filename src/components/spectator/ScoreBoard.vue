// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion horizontal title="Score" expanded-default id="scoreBoard">
    <!-- TEAM NAMES SECTION -->
    <div class="vertical-flex">
      <div class="flex-item transparent">
        <p class="team-name">
          {{ teamNameByColor('MAGENTA') }}
        </p>
      </div>
      <div class="flex-item transparent">
        <p class="team-name">
          {{ teamNameByColor('CYAN') }}
        </p>
      </div>
    </div>

    <!-- SCORES SECTION -->
    <div class="vertical-flex">
      <PopupWrapper popup-position="bottom" style="width: 100%">
        <template #reference>
          <div class="flex-item MAGENTA" style="height: 100%">
            <div class="horizontal-flex team-score">
              <div class="horizontal-flex">
                <font-awesome-icon icon="fa-truck" />
                <p>
                  {{ ordersDeliveredByTeam(teamNameByColor('MAGENTA')).length }}
                </p>

                <font-awesome-icon icon="fa-trophy" />
                <p>{{ scoreByColor('MAGENTA') }}</p>
              </div>

              <font-awesome-icon icon="fa-info-circle" />
            </div>
          </div>
        </template>
        <RewardsPopup
          team="MAGENTA"
          :teamName="teamNameByColor('MAGENTA')"
        ></RewardsPopup>
      </PopupWrapper>
      <PopupWrapper popup-position="bottom" style="width: 100%">
        <template #reference>
          <div class="flex-item CYAN" style="height: 100%">
            <div class="horizontal-flex team-score">
              <div class="horizontal-flex">
                <font-awesome-icon icon="fa-truck" />
                <p>
                  {{ ordersDeliveredByTeam(teamNameByColor('CYAN')).length }}
                </p>
                <font-awesome-icon icon="fa-trophy" />
                <p>{{ scoreByColor('CYAN') }}</p>
              </div>

              <font-awesome-icon icon="fa-info-circle" />
            </div>
          </div>
        </template>
        <RewardsPopup team="CYAN" :teamName="teamNameByColor('CYAN')">
        </RewardsPopup>
      </PopupWrapper>
    </div>
  </Accordion>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import RewardsPopup from '@/components/spectator/popups/RewardsPopup.vue'
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
    text-align: left;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
