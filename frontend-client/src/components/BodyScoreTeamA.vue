<template>
  <div class="awarded-points-parent-container">
    <div class="awarded-points-container ">
      <div class="row m-0 text-left ">
        <div 
          class="col-md-6 " 
          v-for="(award,index) in cyanAwardedPoints" 
          :key='index'>
          <div v-if="cyanAwardedPoints.length !== 0">
              <h6 style="font-size: 13px;">
                  {{index + 1}}.
                  [{{formatSeconds(award['game_time'])}}]
                  {{award.phase.substring(0,3)}}
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
    ...mapState(['scoreCyan', 'phase', 'cyanAwardedPoints'])
  },
  mounted(){
    this.scrollToEndOfCyanPointsDiv()
  },
  watch:{
    'cyanAwardedPoints': function() {
      setTimeout(this.scrollToEndOfCyanPointsDiv, 500)
    }
  },
  methods: {
    ...mapActions(['scrollToEndOfCyanPointsDiv'])
  }
}
</script>

<style scoped>
.awarded-points-container{
  overflow: auto !important;
  height: 33vh !important;
}

</style>