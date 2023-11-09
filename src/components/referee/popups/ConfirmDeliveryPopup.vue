// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="modal-bg" v-show="!hidden"></div>
  <div class="modal" v-show="!hidden">
    <Popup :title="`Confirm delivery of Order ${order.id} for ${team} ?`">
      <div class="horizontal-flex" style="justify-content: space-between">
        <div>
          <p>complexity: {{ order.complexity }}</p>
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
            gametime:
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
        <Button primary @click.prevent="confirmOrder(order, true)">
          Yes
        </Button>
        <Button @click.prevent="confirmOrder(order, false)"> No </Button>
      </div>
    </Popup>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { PropType, type Ref, ref } from 'vue'
import { useSocketStore } from '@/store/socketStore'
import Button from '@/components/shared/ui/Button.vue'
import Order from '@/types/Order'
import Color from '@/types/Color'
import ConfirmDeliveryOutMsg from '@/types/messages/outgoing/ConfirmDeliveryOutMsg'
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
const hidden: Ref<boolean> = ref(false)
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

  // we do not want to wait for the refbox to confirm the delivery until the
  // popup closes, so we hide it.
  hidden.value = true
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.modal-bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: 0.7;
  z-index: 999;
}
.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
