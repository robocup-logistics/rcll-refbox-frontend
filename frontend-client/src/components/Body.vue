<template>
  <div >
    <div class="row m-0">
      <div class="team-cyan-body-container col-md-6 border ">
        <div class="row " >
          <div class="col-md-3 body-machines-container p-0 border-right">
            <BodyMachines color='cyan'/>
          </div>

          <div class="col-md-9 p-0 mt-1">
            <div class="d-flex flex-column m-0">
              <div class="robots-container col-md-12 p-0 "
                  :class="phase === 'PRE_GAME' ? 'border-0' : 'border-bottom'">
                <BodyRobotsTeamCyan v-if="phase !== 'PRE_GAME'"/>
              </div>
              <div class="score-container col-md-12 p-0 "
                   :class="phase === 'PRE_GAME' ? '' : ''"  >
                <BodyScoreTeamA v-if="phase !== 'PRE_GAME'"/>
              </div>
            </div>
          </div>  
        </div>
      </div>

      <div class="team-magenta-body-container col-md-6 border">
        <div class="row " >

          <div class="col-md-9 p-0 mt-1">
            <div class="d-flex flex-column m-0">
              <div class="robots-container col-md-12 p-0 "
                  :class="phase === 'PRE_GAME' ? 'border-0' : 'border-bottom'">
                <!-- <BodyRobotsTeamCyan v-if="phase !== 'PRE_GAME'"/> -->
              </div>
              <div class="score-container col-md-12 p-0 "
                   :class="phase === 'PRE_GAME' ? '' : ''"  >
                <!-- <BodyScoreTeamA v-if="phase !== 'PRE_GAME'"/> -->
              </div>
            </div>
          </div>  
          <div class="col-md-3 body-machines-container p-0 border-left">
            <BodyMachines color='magenta'/>
          </div>
          <!-- Magenta Row ends here -->
        </div>
      </div>
    </div>

    <div class="border-right border-left row m-0 log-msgs-main-container h-100"
         :style="phase === 'PRE_GAME' ? 'height: 35vh !important;' : ''">
      <BodyRefboxLog class="border-bottom-0 p-0 pb-3 col-md-9 bodyRefboxLogCmp"/>
      <AttentionMessagesLogger class="col-md-3 p-0 overflow-auto"/>
    </div>
    
  </div>
</template>

<script>
import BodyMachines from './BodyMachines'
import BodyScoreTeamA from './BodyScoreTeamA'
import BodyRobotsTeamCyan from './BodyRobotsTeamCyan'
import BodyRefboxLog from './BodyRefboxLog'
import AttentionMessagesLogger from './AttentionMessagesLogger'
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Body',
  components: {
    BodyMachines,
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
.team-cyan-body-container, .team-magenta-body-container {
  min-height: 40vh !important;
}
.log-msgs-main-container {
  height:30vh;
}
.bodyRefboxLogCmp {
  overflow-y: auto;
}
.score-container {
  padding-top: 0.1rem !important;
}
</style>