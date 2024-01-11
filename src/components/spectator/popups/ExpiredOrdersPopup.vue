// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Expired orders">
    <div class="horizontal-flex">
      <template v-for="order in expiredOrders">
        <OrderEntity :order="order"></OrderEntity>
      </template>
    </div>
    <p v-if="phase == 'PRODUCTION'">
      Expired orders may still be fulfilled for a certain time span but reward
      less points.
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
import { useGameStore } from '@/store/gameStore'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { phase } = storeToRefs(gameStore)
const orderStore = useOrderStore()
const { expiredOrders } = storeToRefs(orderStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
