<template>
  <div class="col-md-2 border">
    <div class="pause-play-time mt-2">
      <div class="radio-pause-play row justify-content-center align-items-center">
        <div class="pause-play-container mr-2">
          <a class="btn p-0" >
            <font-awesome-icon :icon="['fas','play-circle']" class="fa-2x" />
          </a>
          <a class="btn p-0"> 
            <font-awesome-icon :icon="['fas','pause-circle']" class="fa-2x" />
          </a>  
        </div>
        <div class="time">
          <!-- <h3>{{formatSeconds(getGametime)}}</h3> -->
          <h3 class="marg-bot-0">{{formatSeconds(getGametime)}}</h3>
        </div>
      </div>
    </div>

    <div class="phase row justify-content-center mt-1">
      <a class="btn p-0" @click.prevent="setPreviousPhase">
        <font-awesome-icon :icon="['fas','chevron-left']" class="fa-2x" />
      </a>
      <h3 class="marg-bot-0">{{getPhase}}</h3>
      <a class="btn p-0" @click.prevent="setNextPhase">
        <font-awesome-icon :icon="['fas','chevron-right']" class="fa-2x" />
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
    // setInterval(this.fetchGameState, 1000);
  },
  methods: {
    ...mapActions(['setNextPhase', 'setPreviousPhase','fetchGameState' ])
  }
}
</script>

<style scoped>
.marg-bot-0 {
  margin-bottom: 0px !important;
}
</style>