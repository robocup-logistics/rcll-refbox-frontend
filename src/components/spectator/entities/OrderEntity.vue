// TEMPLATE --------------------------------------------------------------------
<template>
  <PopupWrapper popup-position="bottom">
    <template #reference>
      <div class="order-entity clickable">
        <img
          :src="`/products/${
            orderStore.productByOrder(order)?.['product-img-url']
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
  order: {
    type: Object as PropType<Order>,
    required: true,
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
