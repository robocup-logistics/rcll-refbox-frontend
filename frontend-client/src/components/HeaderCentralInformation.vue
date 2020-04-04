<template>
  <div class="col-md-2 border">
    <div class="pause-play-time mt-2">
      <div class="radio-pause-play row justify-content-center align-items-center">
        <div class="pause-play-container mr-2">
          <a class="btn p-0" >
            <i class="far fa-play-circle fa-2x "></i>
          </a>
          <a class="btn p-0"> 
            <i class="far fa-pause-circle fa-2x"></i>
          </a>  
        </div>
        <div class="time">
          <!-- <h3>{{formatSeconds(getGametime)}}</h3> -->
          <h3>{{formatSeconds(getGametime)}}</h3>
        </div>
      </div>
    </div>

    <div class="phase row justify-content-center mt-1">
      <a class="btn p-0" @click.prevent="setPreviousPhase">
        <i class="fas fa-chevron-left fa-2x"></i>
      </a>
      <h3>{{getPhase}}</h3>
      <a class="btn p-0" @click.prevent="setNextPhase">
        <i class="fas fa-chevron-right fa-2x"></i>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex' 

export default {
  name: 'HeaderCentralInformation',
  computed: {
    ...mapState({
      getPhase: state => state.phase,
      getGametime: state => state.gametime
    })
  },
  mounted() {
    this.fetchGameState();
    setInterval(this.fetchGameState, 1000);
  },
  methods: {
    ...mapActions(['setNextPhase', 'setPreviousPhase','formatSeconds', 'fetchGameState' ]),

    // To format fetched seconds
    formatSeconds(seconds) {
      // seconds = parseFloat(seconds);
      // 328 seconds => 
      seconds = parseInt(seconds)
      let minutes = parseInt(seconds / 60)
      if(minutes < 10) {
        minutes = `0${minutes}`
      }
      let _seconds = parseInt(seconds % 60)
      if(_seconds < 10) {
        _seconds = `0${_seconds}`
      }
      const result = `${minutes}:${_seconds}`
      return result
    }
  }
}
</script>

<style scoped>
h3 {
  margin-bottom: 0px;
}
</style>