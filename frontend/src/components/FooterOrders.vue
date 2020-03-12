<template>
  <div >
    <div >
      <FootersOrdersGenerator 
        v-if="currentPhase === 'Production' || currentPhase === 'Post_game'"
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

</script>

<style>

</style>