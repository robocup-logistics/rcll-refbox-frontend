<template>
  <div  class="machines-container text-left">
    <div v-if="getPhase !== 'Pre_game'">
      <BodyMachinesTeamCyanGenerator  />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BodyMachinesTeamCyanGenerator from './BodyMachinesTeamCyanGenerator';

export default {
  name: 'BodyMachinesTeamCyan',
  components: {
    BodyMachinesTeamCyanGenerator
  },
  computed: {
    ...mapState({
      getPhase: state => state.phase,
      nameCyan: state => state.nameTeamCyan
    })
  }

}
</script>

<style scoped>


.machines-container {
  min-height: 40vh !important;
}


</style>