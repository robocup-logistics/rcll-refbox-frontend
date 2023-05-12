<template>
  <div class="col-md-2 border">
    <div v-if="phase !== 'PRE_GAME'"></div>
    <div class="pause-play-time mt-2">
      <div class="radio-pause-play row justify-content-center align-items-center">
        <div class="pause-play-container mr-2">
          <a v-if="gamestate === 'PAUSED' || gamestate === 'WAIT_START'"
             class="btn  p-0" @click="setGameState('RUNNING')"
             v-shortkey.once="{down:['f2']}"  @shortkey="setGameState('RUNNING')"
             data-toggle="tooltip" data-placement="top" title="start/resume game"
          >
            <font-awesome-icon :icon="['fas','play-circle']" class="fa-2x play-btn"/>
          </a>
          <a v-if="gamestate === 'RUNNING'"
             class="btn p-0" @click="setGameState('PAUSED')"
             v-shortkey.once="{down:['f2']}" @shortkey="setGameState('PAUSED')"
             data-toggle="tooltip" data-placement="top" title="pause game"
          > 
            <font-awesome-icon :icon="['fas','pause-circle']" class="fa-2x pause-btn"/>
          </a>  
        </div>
        <div class="time">
          <!-- <h3>{{formatSeconds(getGametime)}}</h3> -->
          <h4 class="marg-bot-0 time-heading">{{formatSeconds(gametime)}}</h4>
        </div>
      </div>
    </div>

    <div class="phase row justify-content-center align-items-center mt-1">
      <a class="btn p-0" @click.prevent="setPreviousPhase"
         data-toggle="tooltip" data-placement="top" title="return previous phase"
      >
        <font-awesome-icon :icon="['fas','chevron-left']" class="fa-2x previous-btn"/>
      </a>
      <div class="dropdown fixedSizeGamestate text-center" >
        <a class=" btn dropdown-toggle current-phase-anchor " 
          data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
          @click.prevent="togglePhaseMenuAndFocus()" ref="firstOne"
          v-shortkey.once="['f3']" @shortkey="togglePhaseMenuAndFocus()"
        >
          {{phase}}
        </a>
        <div class="dropdown-menu"
          :style="showPhaseSubmenus ? 'display:block' : 'display:none'"
          v-shortkey.once="['esc']" @shortkey="togglePhaseSubmenus()"
        >
          <a class="dropdown-item" href="#" 
            v-show="phase !== 'PRE_GAME'" 
            @click.prevent="switchGamestate('PRE_GAME')"
          >PRE_GAME</a>    
          <a class="dropdown-item" href="#"
            v-show="phase !== 'SETUP'"
            @click.prevent="switchGamestate('SETUP')"
          >SETUP</a>
          <a class="dropdown-item" href="#" 
            v-show="phase !== 'EXPLORATION'"
            @click.prevent="switchGamestate('EXPLORATION')"
          >EXPLORATION</a>
          <a class="dropdown-item" href="#"
            v-show="phase !== 'PRODUCTION'" 
            @click.prevent="switchGamestate('PRODUCTION')"
          >PRODUCTION</a>
          <a class="dropdown-item" href="#"
            v-show="phase !== 'POST_GAME'"
            @click.prevent="switchGamestate('POST_GAME')"
          >POST_GAME</a>
        </div>
      </div>
      <a class="btn  p-0" @click.prevent="setNextPhase"
        data-toggle="tooltip" data-placement="top" title="change to next phase"
      >
        <font-awesome-icon :icon="['fas','chevron-right']" class="fa-2x next-btn"/>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'

const mainStore = useMainStore()
const { phase, gametime, gamestate, showPhaseSubmenus } = storeToRefs(mainStore)

const firstOne: Ref<HTMLAnchorElement | null> = ref(null)

function switchGamestate(state: string) {
  mainStore.setPhase(state)
  mainStore.togglePhaseSubmenus()
}

function togglePhaseMenuAndFocus() {
  mainStore.togglePhaseSubmenus()
  nextTick(() => {
    if (firstOne.value) firstOne.value.focus()
  })
}

function setGameState(gamestate: string) {
  mainStore.setGameState(gamestate)
}

function setPreviousPhase() {
  mainStore.setPreviousPhase()
}

function setNextPhase() {
  mainStore.setNextPhase()
}

function togglePhaseSubmenus() {
  mainStore.togglePhaseSubmenus()
}

defineExpose({ phase, gametime, gamestate, showPhaseSubmenus, firstOne, switchGamestate, togglePhaseMenuAndFocus, setGameState, setPreviousPhase, setNextPhase, togglePhaseSubmenus })
</script>

<style scoped>
.marg-bot-0 {
  margin-bottom: 0px !important;
}

.next-btn:hover, .previous-btn:hover, .play-btn:hover, .pause-btn:hover{
  color: #00bc8c;
}
.current-phase-anchor:hover{
  color: #00bc8c;
}
.current-phase-anchor:hover, .current-phase-anchor:focus{
  box-shadow: none;
}
.dropdown-item:hover, .dropdown-item:focus {
  background-color: rgba(133, 230, 205, 0.5) !important;
}

@media (min-width: 1200px){
  .fixedSizeGamestate{
    width: 155px !important;
  }
  .current-phase-anchor{
    padding: 0.5rem 0rem;
  }
}

@media (max-width: 1540px){
  .previous-btn, .next-btn {
    width: 1em;
    height: 0.7em;
  }
  .time-heading{
    font-size: 1.2rem !important;
  }
  .current-phase-anchor{
    font-size: 0.85rem;
    padding: 0.5rem 0rem;
  }
  .fixedSizeGamestate{
    width: 130px !important;
  }
}
</style>