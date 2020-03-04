<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="team-cyan-body-container col-md-6 border">
        <div class="row" v-if="phase !== 'Pre-Game' && !showFormCyan">
          <div class="col-md-4 body-machines-container p-0">
            <BodyMachinesTeamCyan />
          </div>

          <div class="col-md-8 p-0">
            <div class="row">
              <div class="score-container col-md-12">
                <BodyScoreTeamA />
              </div>
              <div class="robots-container col-md-12">
                <BodyRobotsTeamA />
              </div>
            </div>
          </div>  
          
        </div>
      </div>

      <div class="team-b-body col-md-6 border">
        <h1>Body B</h1>
      </div>
    </div>

    <div class="row">
      <BodyRefboxLog />
    </div>
    
  </div>
</template>

<script>
import BodyMachinesTeamCyan from './BodyMachinesTeamCyan'
import BodyScoreTeamA from './BodyScoreTeamA'
import BodyRobotsTeamA from './BodyRobotsTeamA'
import BodyRefboxLog from './BodyRefboxLog'
import { mapState } from 'vuex';

export default {
  name: 'Body',
  components: {
    BodyMachinesTeamCyan,
    BodyScoreTeamA,
    BodyRobotsTeamA,
    BodyRefboxLog
  }, computed: {
    ...mapState(['phase', 'showFormCyan'])
  }
}
</script>

<style scoped>
.team-cyan-body-container {
  min-height: 40vh !important;
}
</style>