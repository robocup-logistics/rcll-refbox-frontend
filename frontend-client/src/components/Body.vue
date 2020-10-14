<template>
  <div >
    <div class="row m-0">
      <div class="team-cyan-body-container col-xl-6 border">
        <div class="row" >
          <div class="col-xl-3 body-machines-container p-0 border-right">
            <BodyMachinesTeamCyan />
          </div>

          <div class="col-xl-9 p-0 mt-1">
            <div class="row m-0">
              <div class="robots-container col-xl-12 mb-1"
                  :class="phase === 'PRE_GAME' ? 'border-0' : 'border-bottom'">
                <BodyRobotsTeamCyan />
              </div>
              <div class="score-container col-xl-12 p-0 mt-2"
                   :class="phase === 'PRE_GAME' ? '' : ''"  >
                <BodyScoreTeamA />
              </div>
            </div>
          </div>  
        </div>
      </div>

      <div class="team-b-body col-xl-6 border">
      </div>
    </div>

    <div class="border "
         :style="phase === 'PRE_GAME' ? 'height: 35vh !important;' : ''">
      <AttentionMessagesLogger />
      <BodyRefboxLog class="border-bottom-0"/>
    </div>
    
  </div>
</template>

<script>
import BodyMachinesTeamCyan from './BodyMachinesTeamCyan'
import BodyScoreTeamA from './BodyScoreTeamA'
import BodyRobotsTeamCyan from './BodyRobotsTeamCyan'
import BodyRefboxLog from './BodyRefboxLog'
import AttentionMessagesLogger from './AttentionMessagesLogger'
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Body',
  components: {
    BodyMachinesTeamCyan,
    BodyScoreTeamA,
    BodyRobotsTeamCyan,
    BodyRefboxLog,
    AttentionMessagesLogger
  }, computed: {
    ...mapState(['phase', 'showFormCyan', 'gamestate'])
  },
  created(){
    this.connectToWebsocket()
  },
  methods: {
    ...mapActions(['connectToWebsocket'])
  }
}
</script>

<style scoped>
.team-cyan-body-container {
  min-height: 40vh !important;
}
</style>