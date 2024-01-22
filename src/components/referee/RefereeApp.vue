// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="refereeApp" class="vertical-flex" style="padding: 10px">
    <!-- HEADER -->
    <div class="vertical-flex header">
      <div class="horizontal-flex">
        <!-- LOGO AND ACTIONS (LEFT) -->
        <LogoAndActions />
        <!-- GAME INFORMATION -->
        <GameInformation />
        <!-- ATTENTION MESSAGES -->
        <AttentionMessages />
      </div>
    </div>
    <!-- TEAMS -->
    <div class="teams">
      <Team color="CYAN" :teamName="nameTeamCyan" />
      <Team color="MAGENTA" :teamName="nameTeamMagenta" />
    </div>
    <!-- FOOTER -->
    <div class="footer horizontal-flex">
      <!-- ORDERS -->
      <Orders v-if="phase === 'PRODUCTION' || phase === 'POST_GAME'" />

      <!-- LOG -->
      <RefboxLog />
    </div>
    <!-- MODALS -->
    <template
      v-for="unconfirmedOrder in unconfirmedOrders"
      :key="unconfirmedOrder.id"
    >
      <!-- Confirm Delivery Modal -->
      <ConfirmDeliveryPopup
        v-for="unconfirmedDelivery in unconfirmedOrder.unconfirmed_deliveries"
        :order="unconfirmedOrder"
        :team="teamNameByColor(unconfirmedDelivery.team)"
        :color="unconfirmedDelivery.team"
        permanent
      />
      <!-- / End Confirm Delivery Modal -->
    </template>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import LogoAndActions from '@/components/referee/LogoAndActions.vue'
import GameInformation from '@/components/referee/GameInformation.vue'
import AttentionMessages from '@/components/referee/AttentionMessages.vue'
import Orders from '@/components/referee/Orders.vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import RefboxLog from '@/components/referee/RefboxLog.vue'
import Team from '@/components/referee/Team.vue'
import ConfirmDeliveryPopup from '@/components/referee/popups/ConfirmDeliveryPopup.vue'
import { useOrderStore } from '@/store/orderStore'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const orderStore = useOrderStore()
const { phase, nameTeamCyan, nameTeamMagenta, teamNameByColor } =
  storeToRefs(gameStore)
const { unconfirmedOrders } = storeToRefs(orderStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#refereeApp {
  font-family: 'DejaVu Sans Mono', monospace;
  height: 100vh !important;
  max-height: 100vh !important;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: none;

  .header {
    min-height: 85px;
    height: 85px !important;
    max-height: 85px;
  }

  .teams {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .footer {
    flex-grow: 1;
    min-height: 0;
  }
}
</style>
