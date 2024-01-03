// TEMPLATE --------------------------------------------------------------------
<template>
  <PopupWrapper popup-position="bottom">
    <template #reference>
      <div class="order-entity clickable">
        <img
          :src="`/workpieces/${
            orderStore.productByOrder(order)?.['workpiece_url']
          }`"
          alt="img"
        />
        <font-awesome-icon class="info-icon" icon="fa-info-circle" />
      </div>
    </template>
    <OrderPopup :order="order"></OrderPopup>
  </PopupWrapper>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import type { PropType } from 'vue'
import type Order from '@/types/Order'
import OrderPopup from '@/components/spectator/popups/OrderPopup.vue'
import { useOrderStore } from '@/store/orderStore'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const orderStore = useOrderStore()

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  baseColor: {
    type: String,
    required: false,
  },
  ringColors: {
    type: Array<String>,
    required: false,
  },
  capColor: {
    type: String,
    required: false,
  },
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.order-entity {
  position: relative;

  img {
    height: 80px;
    aspect-ratio: 1;
  }

  .info-icon {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
