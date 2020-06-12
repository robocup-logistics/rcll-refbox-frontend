<template>
  <div v-if="isOpen">
    <transition name="modal-container">
      <div class="overlay">
        <div class="modal-container">
          <h6 class="font-weight-bold modal-title-h6">OrderId {{order.id}}: Confirm delivery for {{team}}? </h6>
          <div class="d-flex align-items-center justify-content-between">
            <p class="delivery-infos">
              <span>Complexity: {{order.complexity}}</span>
              <span>base-color: {{order['base-color']}}</span>
              <span v-if="order['ring-colors']">
                ring colors: {{order['ring-colors']}}
              </span>
              <span>cap-color: {{order['cap-color']}}</span>
              <span>
                delivery period: 
                {{formatSeconds(order['delivery-period'][0])}}
                -
                {{formatSeconds(order['delivery-period'][1])}}
              </span>
            </p>
            <img :src="require(`@/assets/products/generated/${getProductsImg(order.id)}`)" 
               class="img-fluid" 
            > 
          </div>
          <div class="modal-buttons">
            <button @click.prevent='orderAcceptance(order,true)' >Yes</button>
            <button @click.prevent='orderAcceptance(order,false)' >No</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ConfirmDeliveryModal',
  props: ['order', 'team', 'color'],
  data(){
    return{
      isOpen: true
    }
  },
  computed: {
    ...mapState({
      products: state => state.orders.products,
    })
  },
  methods: {
    ...mapActions(['populateProductsArray', 'SOCKET_SEND']),
    closeModal() {
      this.isOpen = false;
      console.log(this.order);
      
    },
    getProductsImg(orderID) {
      return this.products.find(({id}) => id === orderID)['product-img-url'];
    },
    // Scroll to end of scrollable div
    scrollToEnd(className){
      let container = document.querySelector(className);
      container.scrollTop = container.scrollHeight;
    },
    orderAcceptance(order, bool) {
      const msg = {
        "command" : "confirm_delivery",
        "delivery_id" : null,
        "correctness" : false,
        "order_id" : null,
        "color" : ""
      }
      msg.correctness = bool
      msg.color = this.color
      msg['delivery_id'] = this.order['quantity-requested']
      msg['order_id'] = this.order.id
      this.SOCKET_SEND(msg)
      this.closeModal()
    }
  }
}
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
  margin-top: 10px;
  margin-left: 10px;
  background-color: black;
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
</style>