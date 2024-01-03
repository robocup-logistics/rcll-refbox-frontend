// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Overtime">
    <div>
      <OvertimeExplainable />
    </div>
    <p>Duration: {{ formatTime(OVERTIME_DURATION) }}</p>
    <template v-if="overtimeOrder">
      <p>Order:</p>
      <OrderEntity :order="overtimeOrder"></OrderEntity>
    </template>

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
import OvertimeExplainable from '@/components/spectator/explainables/OvertimeExplainable.vue'

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
