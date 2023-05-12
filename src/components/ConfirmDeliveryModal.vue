<template>
  <div class="Modal">
   <div v-if="isOpen === true">
    <transition name="modal-container">
      <div class="overlay">
        <div class="modal-container">
          <h6 class="font-weight-bold modal-title-h6">
            OrderId {{order.id}}: Confirm delivery for {{team}}?
          </h6>
          <div class="d-flex align-items-center justify-content-between">
            <p class="delivery-infos">
              <span>
                Complexity: {{order.complexity}}
              </span>
              <span>
                base-color: {{order['base_color']}}
              </span>
              <span v-if="order['ring_colors']">
                ring colors: {{order['ring_colors']}}
              </span>
              <span>
                cap-color: {{order['cap_color']}}
              </span>
              <span v-if="typeof order['unconfirmed_deliveries'][0]['game_time'] !== 'undefined'">
                Gametime: {{formatSeconds(order['unconfirmed_deliveries'][0]['game_time'])}}
              </span>
              <span>
                delivery period: 
                {{formatSeconds(order['delivery_period'][0])}}
                -
                {{formatSeconds(order['delivery_period'][1])}}
              </span>
            </p>
            <img :src="`/products/generated/${getProductsImg(order.id)}`"
              class="img-fluid"
            >
          </div>
          <div class="modal-buttons">
            <button @click.prevent='orderAcceptance(order,true)' class="btn btn-outline-info yes-btn ">Yes</button>
            <button @click.prevent='orderAcceptance(order,false)' class="btn btn-outline-info no-btn">No</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import formatSeconds from '@/utils/formatSeconds'
import { useMainStore } from '@/store/mainStore'
import { useOrderStore } from '@/store/orderStore'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  team: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
})

const mainStore = useMainStore()
const orderStore = useOrderStore()
const { products } = storeToRefs(orderStore)

const isOpen = ref(true)

function closeModal() {
  isOpen.value = false;
}

function getProductsImg(orderID: number) {
  return products.value.find(({id} : {id: number}) => id === orderID)['product-img-url'];
}

function orderAcceptance(order, bool: boolean) {
  const msg = {
    "command" : "confirm_delivery",
    "correctness" : false,
    "delivery_id": null,
    "order_id" : null,
    "color" : ""
  }
  msg.correctness = bool
  msg.color = props.color.toUpperCase()
  msg['order_id'] = props.order.id
  
  if (order['unconfirmed_deliveries'].length > 0) {
    if ( typeof order['unconfirmed_deliveries'][0]['delivery_id'] !== 'undefined') {
      msg['delivery_id'] = order['unconfirmed_deliveries'][0]['delivery_id']
    }
  } else {
      msg['delivery_id'] = msg['order_id']
  }
  
  mainStore.SOCKET_SEND(msg)
  closeModal()
  // this.$destroy()
}

defineExpose({ formatSeconds, isOpen, getProductsImg, orderAcceptance })
</script>

<style scoped>
.modal-container {
  width: 400px;
  margin: auto 0px;
  padding: 20px;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  background-color: rgba(0,0,0,0.7);
  transition: all 0.2s ease-in;
}
.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal-container,
.fadeIn-leave-active.modal-container {
  transform: scale(1.1);
}
.modal-buttons {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.modal-title-h6 {
  color: var(--main-cyan-color);
}
.delivery-infos{
  color: orangered !important;
}
button {
  /* margin-top: 10px;
  margin-left: 10px;
  background-color: black; */
  color: white;
  font-size: 1.1rem;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
}

.delivery-infos{
  display: flex;
  flex-direction: column;
}
.yes-btn {
  margin-right: 10px !important;
  margin-top: 15px !important;
}
</style>