<template>
  <div class="row mt-3">
    <div class="order-1 col-md-1 ">
      <div class="row">
        <div class="image-container col-md-6">
          <img src="http://via.placeholder.com/45x90" alt="">
        </div>
        <div class="order1-info col-md-6">
          <p>2</p>
          <p>[2:30, 5:50]</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'FootersOrders',
  mounted() {
    this.fetchAllOrders()
  },
  methods: {
    ...mapActions(['fetchAllOrders'])
  }
}
</script>

<style>

</style>