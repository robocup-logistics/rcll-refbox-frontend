// TEMPLATE --------------------------------------------------------------------
<template>
  <Modal
    :title="`Confirm delivery of Order ${order.id} for ${team} ?`"
    ref="modal"
  >
    <div class="horizontal-flex" style="justify-content: space-between">
      <div>
        <p>complexity: {{ order.complexity }}</p>
        <p>base-color: {{ order.base_color }}</p>
        <p v-if="order.ring_colors">ring colors: {{ order.ring_colors }}</p>
        <p>cap-color: {{ order.cap_color }}</p>
        <p
          v-if="
            typeof order.unconfirmed_deliveries[0].game_time !== 'undefined'
          "
        >
          game time:
          {{ formatTime(order.unconfirmed_deliveries[0].game_time) }}
        </p>
        <p>
          delivery period:
          {{ formatTime(order.delivery_period[0]) }}
          -
          {{ formatTime(order.delivery_period[1]) }}
        </p>
      </div>
      <img
        :src="`/workpieces/${orderStore.fileNameByWorkpiece(order)}`"
        class="img-fluid"
      />
    </div>
    <div class="horizontal-flex">
      <Button primary @click.prevent="confirmOrder(true)"> Yes </Button>
      <Button @click.prevent="confirmOrder(false)"> No </Button>
    </div>
  </Modal>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Modal from '@/components/shared/ui/Modal.vue'
import { PropType, type Ref, ref } from 'vue'
import Button from '@/components/shared/ui/Button.vue'
import Order from '@/types/Order'
import Color from '@/types/Color'
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
const orderStore = useOrderStore()

// accept order (or not) - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const modal: Ref<typeof Modal | null> = ref(null)
function confirmOrder(bool: boolean): void {
  orderStore.sendConfirmDelivery({
    color: props.color,
    correctness: bool,
    delivery_id:
      props.order.unconfirmed_deliveries.length > 0 &&
      props.order.unconfirmed_deliveries[0].delivery_id !== undefined
        ? props.order.unconfirmed_deliveries[0].delivery_id
        : props.order.id,
    order_id: props.order.id,
  })

  // we do not want to wait for the refbox to confirm the delivery until the
  // popup closes, so we hide it.
  if (modal.value) modal.value.close()
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
