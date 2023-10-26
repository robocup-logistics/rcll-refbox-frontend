// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Overtime">
    <p>
      If both teams have the same score at the end of the production phase, an
      additional overtime of
      {{ formatTime(OVERTIME_DURATION) }} minutes takes place in which both
      teams race against fulfilling the following order:
    </p>
    <OrderEntity :order="overtimeOrder" v-if="overtimeOrder"></OrderEntity>
    <p v-else>Order not yet announced!</p>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import Popup from '@/components/shared/ui/Popup.vue'
import OrderEntity from '@/components/spectator/entities/OrderEntity.vue'
import { useRuleStore } from '@/store/ruleStore'
import { useOrderStore } from '@/store/orderStore'
import formatTime from '@/utils/formatTime'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const orderStore = useOrderStore()
const ruleStore = useRuleStore()
const { overtimeOrder } = storeToRefs(orderStore)
const { OVERTIME_DURATION } = storeToRefs(ruleStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
