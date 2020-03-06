<template>
  <div  class="machines-container  border-right text-left">
    <div v-if="getPhase !== 'Pre-Game'">
      <h4 class="text-center mb-4"
          style="color: var(--main-cyan-color)"
       >Machines Team {{nameCyan}}</h4>
      <BodyMachinesTeamCyanGenerator />
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