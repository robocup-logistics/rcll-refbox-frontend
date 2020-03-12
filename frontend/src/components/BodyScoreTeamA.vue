<template>
  <div >
    <h3 v-if="phase !== 'Pre_game'">Points: {{scoreCyan}}</h3>
    <div class="awarded-points-container">
      <div class="row m-0 text-left">
        <div 
          class="col-md-6"
          v-for="(award,index) in awardedPoints" 
          :key='index'>
          <div v-if="award.team === 'CYAN'">
              <h6 class="text-success" style="font-size: 15px;">
                {{index + 1}}.
                {{award.phase.substring(0,3)}}
                [{{formatSeconds(award['game-time'])}}]
                {{award.points}} point(s): {{award.reason}} 
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
    }
  }
}
</script>

<style>

</style>