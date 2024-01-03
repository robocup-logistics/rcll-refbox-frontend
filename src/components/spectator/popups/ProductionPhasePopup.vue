// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Production phase">
    <div>
      <ProductionPhaseExplainable />
    </div>
    <p>Duration: {{ formatTime(PRODUCTION_DURATION) }}</p>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import Popup from '@/components/shared/ui/Popup.vue'
import OrderEntity from '@/components/spectator/entities/OrderEntity.vue'
import { useRuleStore } from '@/store/ruleStore'
import formatTime from '@/utils/formatTime'
import ProductionPhaseExplainable from '@/components/spectator/explainables/ProductionPhaseExplainable.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const ruleStore = useRuleStore()
const { PRODUCTION_DURATION } = storeToRefs(ruleStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
