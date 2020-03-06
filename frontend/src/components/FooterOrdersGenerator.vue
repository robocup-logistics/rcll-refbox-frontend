<template>
 <!-- <img src="http://via.placeholder.com/45x90" alt=""> -->
  <div>
    <div v-for="order in allOrders" 
         :key=order.id
    >
      <div 
           class="d-flex"
           v-if="order.active === true"
      >
        <div class="image-container">
          <img src="http://via.placeholder.com/45x90" alt=""> 
        </div>  
        <div class="order-info-container ml-2 d-flex flex-column text-left justify-content-around">
          <div class="order-infos ">
            <div>
              <span class="order-quantity">
                Requested: {{order['quantity-requested']}}
              </span>
            </div>

            <div>
              <span>
                Delivered: [
                <span class="quantity-delivered-cyan">{{order ['quantity-delivered'][0]}}</span>,
              </span>
              
              <span class="quantity-delivered-magenta">
                {{order ['quantity-delivered'][1]}}
              </span>
                ]
            </div>

            <div class="order-complexity">
              <span>
                Complexity: {{order.complexity}}
              </span>
            </div>
            <div class="delivery-time">
              <span>{{order['delivery-period'][0]}}-{{order['delivery-period'][1]}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'FootersOrdersGenerator',
  computed: {
    ...mapState({
      allOrders: state => state.orders.allOrders
    })
  },
  mounted() {
    this.fetchAllOrders()
  },
  methods: {
    ...mapActions(['fetchAllOrders'])
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

</style>