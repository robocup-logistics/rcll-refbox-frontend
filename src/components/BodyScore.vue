<template>
  <div class="awarded-points-parent-container">
    <div :class="['awarded-points-container-'+ color]">
      <div class="row m-0 text-left ">
        <div 
          class="col-md-6 " 
          v-for="(award,index) in selectPointsArray(color)" 
          :key='index'>
          <div v-if="selectPointsArray(color).length !== 0">
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
  name: 'BodyScore',
  props: {
    color: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['scoreCyan', 'phase', 'cyanAwardedPoints', 'magentaAwardedPoints'])
  },
  mounted(){
    if (this.color === 'cyan') {
      this.scrollToEndOfCyanPointsDiv()
    } else {
      this.scrollToEndOfMagentaPointsDiv()
    }
  },
  watch:{
    'cyanAwardedPoints': function() {
      if (this.color === 'cyan') {
        setTimeout(this.scrollToEndOfCyanPointsDiv, 500)
      }
    },
    'magentaAwardedPoints': function(){
      if (this.color === 'magenta') {
        setTimeout(this.scrollToEndOfMagentaPointsDiv, 500)
      }
    }
  },
  methods: {
    ...mapActions(['scrollToEndOfCyanPointsDiv', 'scrollToEndOfMagentaPointsDiv']),
    selectPointsArray(color){
      if (color === 'cyan') {
        return this.cyanAwardedPoints
      } else {
        return this.magentaAwardedPoints
      }
    }
  }
}
</script>

<style scoped>
.awarded-points-container-magenta, .awarded-points-container-cyan{
  overflow: auto !important;
  height: 33vh !important;
}

</style>