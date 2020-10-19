<template>
  <div >
    <div >
      <FootersOrdersGenerator 
        v-if="(currentPhase === 'PRODUCTION' || currentPhase === 'POST_GAME')"
        class="d-flex justify-content-around align-items-center px-4 py-3"/>
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

</script>

<style>

</style>