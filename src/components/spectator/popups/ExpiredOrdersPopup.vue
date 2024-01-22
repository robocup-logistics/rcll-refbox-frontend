// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Expired orders" icon="fa-hourglass">
    <ExpiredOrderExplainable />
    <div class="horizontal-flex content-box">
      <OrderEntity v-for="order in expiredOrders" :order="order"></OrderEntity>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import Popup from '@/components/shared/ui/Popup.vue'
import OrderEntity from '@/components/spectator/entities/OrderEntity.vue'
import { useOrderStore } from '@/store/orderStore'
import ExpiredOrderExplainable from '@/components/spectator/explainables/ExpiredOrderExplainable.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const orderStore = useOrderStore()
const { expiredOrders } = storeToRefs(orderStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
