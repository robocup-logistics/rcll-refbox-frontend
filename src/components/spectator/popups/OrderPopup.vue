// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="'Order ' + order.id">
    <p>
      Open from {{ formatTime(order.delivery_period[0]) }} until
      {{ formatTime(order.delivery_period[1]) }}
    </p>
    <p>Requested quantity: {{ order.quantity_requested }}</p>
    <p v-if="order.quantity_delivered[0] != '0'">
      Delivered by
      <span class="CYAN-text">{{ teamNameByColor('CYAN') }}</span>
      <span v-if="order.quantity_requested != 1"
        >({{ order.quantity_delivered[0] }} x)</span
      >
    </p>
    <p v-if="order.quantity_delivered[1] != '0'">
      Delivered by
      <span class="MAGENTA-text">{{ teamNameByColor('MAGENTA') }}</span>
      <span v-if="order.quantity_requested != 1"
        >({{ order.quantity_delivered[1] }} x)</span
      >
    </p>

    <div v-if="order.competitive" class="horizontal-flex" style="color: orange">
      <span>This order is competitive</span>
      <PopupWrapper>
        <template #reference>
          <font-awesome-icon class="clickable" icon="fa-info-circle" />
        </template>
        <Popup title="Competitive orders">
          <p>
            The first team that delivers a competitive order will receive 10
            extra points, while the second team that delivers the order will be
            deducted 10 points.
          </p>
        </Popup>
      </PopupWrapper>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import type { PropType } from 'vue'
import type Order from '@/types/Order'
import Popup from '@/components/shared/ui/Popup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import formatTime from '@/utils/formatTime'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { teamNameByColor } = storeToRefs(gameStore)

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  order: {
    type: Object as PropType<Order>,
    required: true,
  },
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
