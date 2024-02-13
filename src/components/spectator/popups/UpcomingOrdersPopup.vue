// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Upcoming orders" icon="fa-hourglass">
    <ActivatedOrderExplainable />
    <template v-if="upcomingActivatedOrders.length">
      <p>Activated orders (time until start of delivery period):</p>
      <div class="horizontal-flex content-box">
        <div class="order" v-for="order in upcomingActivatedOrders">
          <OrderEntity :order="order"></OrderEntity>
          <p v-if="phase == 'PRODUCTION'">
            {{ formatTime(order.delivery_period[0] - game_time) }}
          </p>
        </div>
      </div>
    </template>
    <template v-if="upcomingNonActivatedOrders.length">
      <p>Not yet activated orders (time until activation):</p>
      <div class="horizontal-flex content-box">
        <div class="order" v-for="order in upcomingNonActivatedOrders">
          <OrderEntity :order="order"></OrderEntity>
          <p v-if="phase == 'PRODUCTION'">
            {{ formatTime(order.activate_at - game_time) }}
          </p>
        </div>
      </div>
    </template>
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
import ActivatedOrderExplainable from '@/components/spectator/explainables/ActivatedOrderExplainable.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { game_time, phase } = storeToRefs(gameStore)
const orderStore = useOrderStore()
const { upcomingActivatedOrders, upcomingNonActivatedOrders } =
  storeToRefs(orderStore)
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
