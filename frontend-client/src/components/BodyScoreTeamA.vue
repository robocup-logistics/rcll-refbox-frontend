<template>
  <div >
    <h3 v-if="phase !== 'Pre_game'">Points: {{scoreCyan}}</h3>
    <div class="awarded-points-container border-top">
      <div class="row m-0 text-left ">
        <div 
          class="col-md-6"
          v-for="(award,index) in awardedPoints" 
          :key='index'>
          <div v-if="award.team === 'CYAN'">
              <h6 style="font-size: 15px;">
                {{index + 1}}.
                [{{formatSeconds(award['game-time'])}}]
                {{award.phase.substring(0,4)}}
                <span class="text-light">{{award.points}}</span> point(s)
                <br>
                <span class="text-success" style="font-weight:300">{{award.reason}}</span>
                <!-- If the rest of the reason isn`t needed -->
                <!-- <span class="text-success" style="font-weight:300">{{award.reason.split(':')[0]}}</span> -->
                </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'BodyScoreTeamA',
  computed: {
    ...mapState(['scoreCyan', 'phase', 'awardedPoints'])
  },
  mounted() {
    this.fetchAwardedPoints();
    this.pollAwardedPoints();
  },
  updated(){
    // Scroll to bottom of awarded points on each added reason
    this.scrollToEnd('.awarded-points-container');
  },
  methods: {
    ...mapActions(['fetchAwardedPoints']),
    pollAwardedPoints() {
      console.log(this.awardedPoints);
      setInterval(this.fetchAwardedPoints, 1500);
    },
    formatSeconds(seconds) {
      // 328 seconds => 
      seconds = parseInt(seconds);
      let minutes = parseInt(seconds / 60);
      if(minutes < 10) {
        minutes = `0${minutes}`;
      }
      let _seconds = parseInt(seconds % 60);
      if(_seconds < 10) {
        _seconds = `0${_seconds}`;
      }
      const result = `${minutes}:${_seconds}`;
      return result;
    },
    // Scroll to end of scrollable div
    scrollToEnd(className){
      let container = document.querySelector(className);
      container.scrollTop = container.scrollHeight;
    }
  }
}
</script>

<style scoped>
.awarded-points-container{
  overflow: auto !important;
  max-height: 35vh !important;
}
</style>