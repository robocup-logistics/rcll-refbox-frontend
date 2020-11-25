<template>
  <div  class="machines-container text-left h-100 w-100">
    <div v-if="getPhase !== 'PRE_GAME'" class="w-100 h-100">
      <BodyMachinesTeamCyanGenerator class="h-100 w-100" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BodyMachinesTeamCyanGenerator from './BodyMachinesTeamCyanGenerator';

export default {
  name: 'BodyMachines',
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