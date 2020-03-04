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
          <h3>20:30</h3>
        </div>
      </div>
    </div>

    <div class="phase row justify-content-center mt-1">
      <a class="btn p-0" @click.prevent="setPreviousPhase">
        <i class="fas fa-chevron-left fa-2x"></i>
      </a>
      <h3 @click="fetchAllMachines">{{getPhase}}</h3>
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
      getPhase: state => state.phase
    })
  },
  methods: {
    ...mapActions(['setNextPhase', 'setPreviousPhase','fetchAllMachines' ])
  }
}
</script>

<style scoped>
h3 {
  margin-bottom: 0px;
}
</style>