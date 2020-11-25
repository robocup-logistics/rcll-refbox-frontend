<template>
  <div  class="machines-container text-left h-100 w-100">
    <div v-if="getPhase !== 'PRE_GAME'" class="w-100 h-100">
      <BodyMachinesGenerator class="h-100 w-100" :color=color />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BodyMachinesGenerator from './BodyMachinesGenerator';

export default {
  name: 'BodyMachines',
  props: {
    color: {
      type: String,
      required: true
    }
  },
  components: {
    BodyMachinesGenerator
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