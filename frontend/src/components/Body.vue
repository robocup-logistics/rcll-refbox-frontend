<template>
  <div >
    <div class="row m-0">
      <div class="team-cyan-body-container col-xl-6 border">
        <div class="row" v-if="phase !== 'Pre_Game' && !showFormCyan">
          <div class="col-xl-6 body-machines-container p-0">
            <BodyMachinesTeamCyan />
          </div>

          <div class="col-xl-6 p-0 mt-3">
            <div class="row m-0">
              <div class="score-container col-xl-12 p-0 border-bottom ">
                <BodyScoreTeamA />
              </div>
              <div class="robots-container col-xl-12 mt-4 ">
                <BodyRobotsTeamA />
              </div>
            </div>
          </div>  
          
        </div>
      </div>

      <div class="team-b-body col-xl-6 border">
        <h1>Body B</h1>
      </div>
    </div>

    <div class="">
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