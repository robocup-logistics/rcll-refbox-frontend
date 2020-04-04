<template>
 <!-- <img src="http://via.placeholder.com/45x90" alt=""> -->
  <div>
    <div v-for="order in allOrders" 
         :key=order.id
         class="max-height-81"
    >
      <div class="d-flex " >
        <div class="max-height-81 pb-0 mb-0 d-flex">
          <img :src="require(`@/assets/products/generated/${getProductsImg(order.id)}`)" 
               class="max-height-81 max-width-65 img-fluid" 
          > 
          <!-- c0_black__black.svg -->
        </div>  
        <div 
            class="order-info-container ml-2 d-flex flex-column text-left justify-content-around"
            style="font-size:14px"
            >
          <div class="order-infos ">
            <div>
            <div class="d-flex justify-items-center align-items-center ">
              <div pt-5>
                <span>{{order.id}}</span>
              </div>
              <form >
                <!-- If requested amount is 1 -->
                <div 
                  v-if="order['quantity-requested'] === 1"
                  class="form-group m-0 ml-2 d-flex">
                  <div class="custom-control custom-checkbox">
                    <!-- Checked only if the order was delivered -->
                    <input 
                      type="checkbox" class="custom-control-input"
                      :id="cyanCheckboxId(order.id)"  
                      disabled
                      :checked="isDelivered(order['quantity-delivered'][0], 
                      order['quantity-requested'])
                      "
                    >
                    <!-- Confirm Delivery Popup modal -->
                    <div v-once v-if="isDelivered(order['quantity-delivered'][0], 
                      order['quantity-requested']) === true">
                      <ConfirmDeliveryModal  :order = 'order' :team="nameTeamCyan"/>
                    </div>
                    <!-- End of modal -->
                    <label class="custom-control-label" 
                      :for="cyanCheckboxId(order.id)"
                    ></label>
                  </div>
                  <div 
                    class="custom-control custom-checkbox  custom-checkbox-magenta">
                    <input type="checkbox" 
                      class="custom-control-input custom-control-input-magenta" 
                      id="customCheck2" disabled>
                    <label 
                      class="custom-control-label custom-control-label-magenta" for="customCheck2">
                    </label>
                  </div>
                </div>
                <!-- If requested amount is 2  -->
                <div 
                  v-else-if="order['quantity-requested'] === 2 "
                  class="form-group m-0 ml-2 d-flex flex-column">
                  <div>
                    <div class= "d-flex">
                      <div class="custom-control custom-checkbox">
                        <!-- Checked only if the order was delivered -->
                        <input 
                          type="checkbox" class="custom-control-input"       id="customCheck1"  disabled
                          :checked="isDelivered(order['quantity-delivered'][0], 
                          order['quantity-requested'])"
                        >
                        <label class="custom-control-label" for="customCheck1">
                        </label>
                      </div>
                      <div 
                        class="custom-control custom-checkbox custom-checkbox-magenta">
                        <input type="checkbox" 
                            class="custom-control-input custom-control-input-magenta" 
                            id="customCheck2" disabled>
                        <label 
                          class="custom-control-label custom-control-label-magenta" 
                          for="customCheck2">
                        </label>
                      </div>
                    </div>
                  </div>
                  <!-- If the first was  delivered -->
                  <div  class="d-flex">
                    <div class="custom-control custom-checkbox">
                      <!-- Checked only if the order was delivered -->
                      <input 
                        type="checkbox" class="custom-control-input"       id="customCheck1"  disabled
                        :checked="isDeliveredSecond(order['quantity-delivered'][0])"
                      >
                      <label class="custom-control-label" for="customCheck1"></label>
                    </div>
                    <div 
                      class="custom-control custom-checkbox custom-checkbox-magenta">
                      <input type="checkbox" 
                        class="custom-control-input custom-control-input-magenta" 
                        id="customCheck2" disabled>
                      <label class="custom-control-label custom-control-label-magenta" for="customCheck2">
                      </label>
                    </div>
                  </div>
                </div>
              </form>
              <div class="text-center">
                      <span v-if="order.competitive" class="text-warning ">C</span>
              </div>
          </div>  
            </div>

            <div class="order-complexity">
              <span>
                Complexity: {{order.complexity}}
              </span>
            </div>
            <div class="delivery-time">
              <span>{{ formatSeconds(order['delivery-period'][0]) }}-{{formatSeconds(order['delivery-period'][1])}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ConfirmDeliveryModal from './ConfirmDeliveryModal'

export default {
  name: 'FootersOrdersGenerator',
  components: {
    ConfirmDeliveryModal,
  },
  computed: {
    ...mapState({
      allOrders: state => state.orders.allOrders,
      products: state => state.orders.products,
      populated: state => state.orders.populated,
      nameTeamCyan: state => state.nameTeamCyan
    })
  },
  mounted() {
    this.fetchAllOrders();
    this.pollAllOrders();
  },
  methods: {
    ...mapActions(['fetchAllOrders', 'populateProductsArray',]),
    pollAllOrders() {
      setInterval(this.fetchAllOrders, 1500);
    },
    // Returns the img url responding to order ID
    getProductsImg(orderID) {
      return this.products.find(({id}) => id === orderID)['product-img-url'];
    },
    // Checks if the order was delivered
    isDelivered(currDelivered, requested) {
      if (parseInt(currDelivered) >= requested || parseInt(currDelivered) === 1){
        return true;
      } else {
        return false;
      }
    },
    isDeliveredSecond(currDelivered) {
      if (parseInt(currDelivered) === 2){
        return true;
      } else {
        return false;
      }
    },
    cyanCheckboxId(orderId) {
      return `cyanCheckbox-${orderId}`;
    }
  }
}

</script>

<style >

.quantity-delivered-cyan {
  color: var(--main-cyan-color)
}
.quantity-delivered-magenta {
  color: var(--main-magenta-color)
}

/* Remove Bootsrap defaults */
.custom-checkbox .custom-control-label::before {
  border: 1px solid var(--main-cyan-color) !important;
  border-radius: 50% !important;
  background-color: #2B3E50 !important;
}

.custom-control-input:checked ~ .custom-control-label::before {
    color: #fff;
    border-color: var(--main-cyan-color) !important;
    background-color: var(--main-cyan-color)  !important;
}

.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
    background-image: url('../assets/checkedMark.png') !important;
}

.custom-checkbox-magenta .custom-control-label-magenta::before {
  border: 1px solid var(--main-magenta-color) !important;
  border-radius: 50% !important;
  background-color: #2B3E50 !important;
}

.custom-control-input-magenta:checked ~ .custom-control-label-magenta::before {
    color: #fff;
    border-color: var(--main-magenta-color) !important;
    background-color: var(--main-magenta-color)  !important;
}

.max-height-81{
  max-height: 91px !important;
}

.max-width-65{
  max-width: 65px !important;
}

</style>