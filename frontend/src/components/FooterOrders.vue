<template>
  <div >
    <div >
      <FootersOrdersGenerator 
        class="d-flex justify-content-around p-4"/>
    </div>
  </div>
</template>

<script>
import FootersOrdersGenerator from './FooterOrdersGenerator'
import { mapState } from 'vuex'
export default {
  name: 'FootersOrders',
  components: {
    FootersOrdersGenerator
  },
  computed: {
    ...mapState({
      currentPhase: state => state.phase
    })
  }
}
// v-if="currentPhase === 'production'"
</script>

<style>

</style>