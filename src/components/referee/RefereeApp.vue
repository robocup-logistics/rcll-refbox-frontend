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
      <Team color="MAGENTA" :teamName="nameTeamMagenta" />
      <Team color="CYAN" :teamName="nameTeamCyan" />
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

    <template
      v-for="machine in machines.filter((m) => m.referee_required)"
      :key="machine.name"
    >
      <SetMachineWorkStatusPopup
        :asPopup="false"
        :name="machine.name"
        permanent
      />
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
import { useMachineStore } from '@/store/machineStore'
import RefboxLog from '@/components/referee/RefboxLog.vue'
import Team from '@/components/referee/Team.vue'
import ConfirmDeliveryPopup from '@/components/referee/popups/ConfirmDeliveryPopup.vue'
import SetMachineWorkStatusPopup from '@/components/referee/popups/SetMachineWorkStatusPopup.vue'
import { useOrderStore } from '@/store/orderStore'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const orderStore = useOrderStore()
const machineStore = useMachineStore()
const { phase, nameTeamCyan, nameTeamMagenta, teamNameByColor } =
  storeToRefs(gameStore)
const { machines } = storeToRefs(machineStore)
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
