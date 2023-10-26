// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="`Confirm delivery of Order ${order.id} for ${team} ?`">
    <div class="horizontal-flex" style="justify-content: space-between">
      <div>
        <p>Complexity: {{ order.complexity }}</p>
        <p>base-color: {{ order['base_color'] }}</p>
        <p v-if="order['ring_colors']">
          ring colors: {{ order['ring_colors'] }}
        </p>
        <p>cap-color: {{ order['cap_color'] }}</p>
        <p
          v-if="
            typeof order['unconfirmed_deliveries'][0]['game_time'] !==
            'undefined'
          "
        >
          Gametime:
          {{ formatTime(order['unconfirmed_deliveries'][0]['game_time']) }}
        </p>
        <p>
          delivery period:
          {{ formatTime(order['delivery_period'][0]) }}
          -
          {{ formatTime(order['delivery_period'][1]) }}
        </p>
      </div>
      <img
        :src="`/products/${
          orderStore.productByOrder(order)?.['product-img-url']
        }`"
        class="img-fluid"
      />
    </div>
    <div class="horizontal-flex">
      <Button primary @click.prevent="confirmOrder(order, true)"> Yes </Button>
      <Button @click.prevent="confirmOrder(order, false)"> No </Button>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { PropType, inject } from 'vue'
import { useSocketStore } from '@/store/socketStore'
import Button from '@/components/shared/ui/Button.vue'
import Order from '@/types/Order'
import Color from '@/types/Color'
import ConfirmDeliveryOutMsg from '@/types/messages/ConfirmDeliveryOutMsg'
import formatTime from '@/utils/formatTime'
import { useOrderStore } from '@/store/orderStore'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  order: {
    type: Object as PropType<Order>,
    required: true,
  },
  team: {
    type: String as PropType<string>,
    required: true,
  },
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const socketStore = useSocketStore()
const orderStore = useOrderStore()

// accept order (or not) - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function confirmOrder(order: Order, bool: boolean): void {
  const msg: ConfirmDeliveryOutMsg = {
    command: 'confirm_delivery',
    correctness: bool,
    delivery_id: null,
    order_id: props.order.id,
    color: props.color,
  }

  if (order['unconfirmed_deliveries'].length > 0) {
    if (
      typeof order['unconfirmed_deliveries'][0]['delivery_id'] !== 'undefined'
    ) {
      msg['delivery_id'] = order['unconfirmed_deliveries'][0]['delivery_id']
    }
  } else {
    msg['delivery_id'] = msg['order_id']
  }

  socketStore.SOCKET_SEND(msg)
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
