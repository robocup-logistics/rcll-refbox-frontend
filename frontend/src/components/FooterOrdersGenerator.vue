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
          <img src="http://via.placeholder.com/37x90" alt=""> 
        </div>  
        <div 
            class="order-info-container ml-2 d-flex    flex-column text-left justify-content-around"
            style="font-size:14px"
            >
          <div class="order-infos ">
            <div>
              <span class="order-quantity">
                Requested: {{order['quantity-requested']}}
              </span>
            </div>

            <div>
              <span>
                Delivered:
                [<span class="quantity-delivered-cyan">{{order ['quantity-delivered'][0]}}</span>,
              </span>

              <span class="quantity-delivered-magenta">
                {{order ['quantity-delivered'][1]}}</span>]
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

export default {
  name: 'FootersOrdersGenerator',
  computed: {
    ...mapState({
      allOrders: state => state.orders.allOrders
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
    formatSeconds(seconds) {
      // 328 seconds => 
      seconds = parseInt(seconds)
      let minutes = parseInt(seconds / 60)
      if(minutes < 10) {
        minutes = `0${minutes}`
      }
      let _seconds = parseInt(seconds % 60)
      if(_seconds < 10) {
        _seconds = `0${_seconds}`
      }
      const result = `${minutes}:${_seconds}`
      return result
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

</style>