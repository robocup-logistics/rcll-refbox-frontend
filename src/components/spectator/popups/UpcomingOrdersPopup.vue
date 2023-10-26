// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Upcoming orders">
    <div class="horizontal-flex">
      <template v-for="order in upcomingOrders">
        <div class="order">
          <OrderEntity :order="order"></OrderEntity>
          <p v-if="phase == 'PRODUCTION'">
            in
            {{ formatTime(parseInt(order.delivery_period[0]) - gametime) }}
          </p>
        </div>
      </template>
    </div>
    <p v-if="phase == 'SETUP'">
      The orders will spawn after each other during the production phase. Click
      on an order to see when the order will be active.
    </p>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import Popup from '@/components/shared/ui/Popup.vue'
import OrderEntity from '@/components/spectator/entities/OrderEntity.vue'
import { useOrderStore } from '@/store/orderStore'
import formatTime from '@/utils/formatTime'
import { useGameStore } from '@/store/gameStore'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { gametime, phase } = storeToRefs(gameStore)
const orderStore = useOrderStore()
const { upcomingOrders } = storeToRefs(orderStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.order {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
