<template>
  <div class="col-md-2 border">
    <div v-if="getPhase !== 'PRE_GAME'"></div>
    <div class="pause-play-time mt-2">
      <div class="radio-pause-play row justify-content-center align-items-center">
        <div class="pause-play-container mr-2">
          <a class="btn  p-0" @click="setGameState('RUNNING')" >
            <font-awesome-icon :icon="['fas','play-circle']" class="fa-2x play-btn" />
          </a>
          <a class="btn p-0" @click="setGameState('PAUSED')"
          > 
            <font-awesome-icon :icon="['fas','pause-circle']" class="fa-2x pause-btn " 
                               :class="gamestate === 'PAUSED' ? 'bg-danger' : ''"
            />
          </a>  
        </div>
        <div class="time">
          <!-- <h3>{{formatSeconds(getGametime)}}</h3> -->
          <h4 class="marg-bot-0">{{formatSeconds(getGametime)}}</h4>
        </div>
      </div>
    </div>

    <div class="phase row justify-content-center align-items-center mt-1">
      <a class="btn  p-0" @click.prevent="setPreviousPhase">
        <font-awesome-icon :icon="['fas','chevron-left']" class="fa-2x previous-btn" />
      </a>
      <h4 class="marg-bot-0">{{getPhase}}</h4>
      <a class="btn  p-0" @click.prevent="setNextPhase">
        <font-awesome-icon :icon="['fas','chevron-right']" class="fa-2x next-btn" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex' 

export default {
  name: 'HeaderCentralInformation',
  computed: {
    ...mapState({
      getPhase: state => state.phase,
      getGametime: state => state.gametime,
      gamestate: state => state.gamestate
    })
  },
}
</script>

<style scoped>
.marg-bot-0 {
  margin-bottom: 0px !important;
}

.next-btn:hover, .previous-btn:hover, .play-btn:hover, .pause-btn:hover{
  color: green;
}
</style>