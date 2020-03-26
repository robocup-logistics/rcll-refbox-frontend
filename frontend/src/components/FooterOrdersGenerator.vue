<template>
 <!-- <img src="http://via.placeholder.com/45x90" alt=""> -->
  <div>
    <div v-for="order in allOrders" 
         :key=order.id
    >
      <div class="d-flex" >
        <div class="image-container d-flex flex-column">
          <img src="http://via.placeholder.com/37x90" alt=""> 
        </div>  
        <div 
            class="order-info-container ml-2 d-flex flex-column text-left justify-content-around"
            style="font-size:14px"
            >
          <div class="order-infos ">
            <!-- <div>
              <span class="order-quantity">
                Requested: {{order['quantity-requested']}}
              </span>
            </div> -->

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
              <span>{{formatSeconds(order['delivery-period'][0])}}-{{formatSeconds(order['delivery-period'][1])}}</span>
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
    ConfirmDeliveryModal
  },
  computed: {
    ...mapState({
      allOrders: state => state.orders.allOrders,
      nameTeamCyan: state => state.nameTeamCyan
    })
  },
  mounted() {
    this.fetchAllOrders()
    this.pollAllOrders()
  },

  methods: {
    ...mapActions(['fetchAllOrders']),
    pollAllOrders() {
      setInterval(this.fetchAllOrders, 1500);
    },
    // To format fetched seconds
    formatSeconds(seconds) {
      // 328 seconds => 
      seconds = parseInt(seconds);
      let minutes = parseInt(seconds / 60);
      if(minutes < 10) {
        minutes = `0${minutes}`;
      }
      let _seconds = parseInt(seconds % 60);
      if(_seconds < 10) {
        _seconds = `0${_seconds}`;
      }
      const result = `${minutes}:${_seconds}`;
      return result;
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



</style>