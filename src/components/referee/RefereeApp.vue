// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="refereeView" class="section" style="padding: 10px">
    <!-- HEADER -->
    <div class="section header">
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
      <Team color="CYAN" :teamName="teamNameByColor('CYAN')" />
      <Team color="MAGENTA" :teamName="teamNameByColor('MAGENTA')" />
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
      <div class="modal-bg"></div>
      <div class="modal">
        <ConfirmDeliveryPopup
          v-for="unconfirmedDeliveryElement in unconfirmedOrder[
            'unconfirmed_deliveries'
          ]"
          :order="unconfirmedOrder"
          :team="teamNameByColor(unconfirmedDeliveryElement.team)"
          :color="unconfirmedDeliveryElement.team"
          permanent
        />
      </div>
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
const { phase, teamNameByColor } = storeToRefs(gameStore)
const { unconfirmedOrders } = storeToRefs(orderStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#refereeView {
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

  .modal-bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    opacity: 0.7;
    z-index: 999;
  }
  .modal {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
}
</style>
