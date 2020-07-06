<template>
 <!-- <img src="http://via.placeholder.com/45x90" alt=""> -->
  <div>
    <div v-for="order in allOrders" 
         :key=order.id
         class="max-height-91"
    >
      <div class="d-flex " >
        <div class="max-height-91 pb-0 mb-0 d-flex">
          <img 
              v-if="products.length === 9"
              :src="require(`@/assets/products/generated/${getProductsImg(order.id)}`)" 
               class="max-height-91 max-width-65 img-fluid" 
               :class="activeDeliveryPeriodImage(order['delivery_period'])"
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
              <div pt-5 :class="activeDeliveryPeriod(order['delivery_period'])">
                <span>{{order.id}}</span>
              </div>
              <form >
                <!-- If requested amount is 1 -->
                <div 
                  v-if="order['quantity_requested'] === 1"
                  class="form-group m-0 ml-2 d-flex text-primary">
                  <div class="custom-control custom-checkbox">
                    <!-- Checked only if the order was delivered -->
                    <input 
                      type="checkbox" class="custom-control-input"
                      :id="cyanCheckboxId(order.id)"  
                      disabled
                      :checked="isDelivered(order['quantity_delivered'][0], 
                      order['quantity_requested'])
                      "
                    >
                    <!-- Confirm Delivery Popup modal -->
                    <div v-for="unconfirmedOrder in  unconfirmedOrders" 
                    :key="unconfirmedOrder.id">
                      <div v-if="unconfirmedOrder.id === order.id && unconfirmedOrder['unconfirmed_deliveries'].length === 1">
                        <ConfirmDeliveryModal   :order = 'unconfirmedOrder' :team="getCorrespondingTeamname(unconfirmedOrder['unconfirmed_deliveries'][0].team)" :color="unconfirmedOrder['unconfirmed_deliveries'][0].team"/>
                      </div>
                      <!-- If there are more than one unconfirmed delivery for the corresponding order loop through all -->
                      <div v-else-if="unconfirmedOrder.id === order.id && unconfirmedOrder['unconfirmed_deliveries'].length > 1">
                        <ConfirmDeliveryModal   
                        v-for="(unconfirmedDeliveryElement,index) in unconfirmedOrder['unconfirmed_deliveries'] " :key="index"
                        :order = 'unconfirmedOrder' :team="getCorrespondingTeamname(unconfirmedDeliveryElement.team)" :color='unconfirmedDeliveryElement.team'/>
                      </div>
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
                  v-else-if="order['quantity_requested'] === 2 "
                  class="form-group m-0 ml-2 d-flex flex-column">
                  <div>
                    <div class= "d-flex">
                      <div class="custom-control custom-checkbox">
                        <!-- Checked only if the order was delivered -->
                        <input 
                          type="checkbox" class="custom-control-input"       id="customCheck1"  disabled
                          :checked="isDelivered(order['quantity_delivered'][0], 
                          order['quantity_requested'])"
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
                        :checked="isDeliveredSecond(order['quantity_delivered'][0])"
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
                  <!-- Confirm Delivery Popup modal -->
                    <div v-for="unconfirmedOrder in  unconfirmedOrders" 
                    :key="unconfirmedOrder.id">
                      <div v-if="unconfirmedOrder.id === order.id && unconfirmedOrder['unconfirmed_deliveries'].length === 1">
                        <ConfirmDeliveryModal   :order = 'unconfirmedOrder' :team="getCorrespondingTeamname(unconfirmedOrder['unconfirmed_deliveries'][0].team)" :color="unconfirmedOrder['unconfirmed_deliveries'][0].team"/>
                      </div>
                      <!-- If there are more than one unconfirmed delivery for the corresponding order loop through all -->
                      <div v-else-if="unconfirmedOrder.id === order.id && unconfirmedOrder['unconfirmed_deliveries'].length > 1">
                        <ConfirmDeliveryModal   
                        v-for="(unconfirmedDeliveryElement,index) in unconfirmedOrder['unconfirmed_deliveries'] " :key="index"
                        :order = 'unconfirmedOrder' :team="getCorrespondingTeamname(unconfirmedDeliveryElement.team)" :color='unconfirmedDeliveryElement.team'/>
                      </div>
                    </div>
                    <!-- End of modal -->
                </div>
              </form>
              <div class="text-center">
                      <span v-if="order.competitive" class="text-warning ">C</span>
              </div>
          </div>  
            </div>

            <div class="order-complexity"
                 :class="activeDeliveryPeriod(order['delivery_period'])"
                 style="font-size: 12px"
            >
              <span>
                Complexity: {{order.complexity}}
              </span>
            </div>
            <div class="delivery-time" 
                 :class="activeDeliveryPeriod(order['delivery_period'])"
            >
              <span>{{ formatSeconds(order['delivery_period'][0]) }}-{{formatSeconds(order['delivery_period'][1])}}</span>
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
  data(){
    return {
      cyan: 'CYAN',
      magenta: 'MAGENTA'
    }
  },
  computed: {
    ...mapState({
      allOrders: state => state.orders.allOrders,
      products: state => state.orders.products,
      populated: state => state.orders.populated,
      nameTeamCYAN: state => state.nameTeamCyan,
      gametime: state => state.gametime,
      nameTeamMAGENTA: state => state.nameTeamMagenta
    }),
    unconfirmedOrders() {
      console.log(this.allOrders.filter(order => order['unconfirmed_deliveries'].length > 0), 'UNCONIRMED');
      
      return this.allOrders.filter(order => order['unconfirmed_deliveries'].length > 0)
    }
  },
  methods: {
    ...mapActions(['populateProductsArray',]),
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
    },
    // Grays out orders that are not active
    activeDeliveryPeriod(deliveryPeriod){
      // Check if it is in the delivery period
      if (deliveryPeriod[0] <= parseInt(this.gametime) && deliveryPeriod[1] >= parseInt(this.gametime)) {
        return 'text-active'
      } else {
        return 'text-muted'
      }
    },
    activeDeliveryPeriodImage(deliveryPeriod){
      // Check if it is in the delivery period
      if (deliveryPeriod[0] <= parseInt(this.gametime) && deliveryPeriod[1] >= parseInt(this.gametime)) {
        return ''
      } 
      // If it's not
      else {
        return 'opacity-4'
      }
    },
    getCorrespondingTeamname(color) {
      if (color === 'CYAN') {
        return this.nameTeamCYAN
      } else {
        return this.nameTeamMAGENTA
      }
    }
  }
}

</script>

<style scoped>

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

.max-height-91{
  max-height: 91px !important;
}

.max-width-65{
  max-width: 65px !important;
}
.opacity-4{
  opacity: .4;
}

</style>
