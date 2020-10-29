<template>
  <div>
    <div class="row m-0 pt-2 h-100 w-100">
        <div class=" col-md-12 col-md-3"
             :class="[machine.mtype+'-station']"
             v-for="(machine,index) in machinesCyan" 
             :key="index" 
        >
          <div class="d-flex align-content-center ml-2" >
            <div class="base-image-container mr-1">
                    <figure>
                      <div class="station-specific-info-container text-center"
                           :class="setMachineBackground(machine)" 
                      >
                        <span class="text-active font-weight-bold text-center">{{machine.name}}</span>
                      </div>
                      <figcaption class="text-center machine-zone">
                          <span >{{machine.zone}}</span> 
                      </figcaption>
                    </figure>
            </div>
            <div class="machine-info d-flex flex-column ">
                  <span :class="setStateClass(machine.state)" >
                    {{machine.state}}
                  </span>
                  <!-- If RS show additional Info -->
                  <div v-if="machine.mtype === 'RS'" class="d-flex my-1">
                    <span class="lead">{{machine['bases_added'] - machine['bases_used']}}</span>
                    <div class="ml-2 d-flex">
                      <div 
                        class="rs-color-container mr-1 text-center"
                        :class="setRSandBSColor(machine['rs_ring_colors'][0])">
                        <span class="lead">{{showPreparedColorInfo(machine['rs_ring_colors'][0])}}</span>

                      </div>
                      <div 
                        class="rs-color-container mx-1 text-center"
                        :class="setRSandBSColor(machine['rs_ring_colors'][1])">
                        <span class="lead">{{showPreparedColorInfo(machine['rs_ring_colors'][1])}}</span>

                      </div>
                    </div>
                  </div>
                  <!-- <span>{{machine.name}}</span> -->
                  <div class="machine-rotation">
                        <span v-if="currPhase === 'SETUP'">{{machine.rotation}}°</span>
                      </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import {mapState } from 'vuex';
export default {
  name: 'BodyMachinesTeamCyanGenerator',
  computed: {
    ...mapState({
      machinesCyan: state => state.machines.machinesCyan,
      currPhase: state => state.phase,
      ringspecs: state => state.machines.ringspecs,
    })
  },

  data() {
    return {
      imageUrl: 'http://via.placeholder.com/50x25'
    }
  },
 

  methods: {
    // Set classname depending on the State of the machine
    setStateClass(state) {
      let classList = ''
      if (state === 'IDLE' || state ==='WAIT-IDLE') {
        classList += 'machine-state-large text-light lead'
      } else if (state === 'BROKEN' || state === 'DOWN'){
        classList += 'machine-state-small text-danger lead '
      }else {
        classList += 'machine-state-small text-warning lead'
      }
      return classList;
    },
    // Display how much bases the ring needs
    showPreparedColorInfo(ringColor) {
      let reqBases = 0;   
      this.ringspecs.forEach((ringspec) => {
        if(ringspec.color === ringColor) {
          reqBases = ringspec['req_bases'];
        }
      });
      return `${reqBases}`;
    },
    // Sets background color depending on the ringcolor and BS-Color
    setRSandBSColor(color) {
      if (color === 'RING_BLUE') {
        return 'bg-blue'
      } else if (color === 'RING_ORANGE') {
        return 'bg-orange'
      } else if (color === 'RING_GREEN') {
        return 'bg-green'
      } else if (color === 'RING_YELLOW') {
        return 'bg-yellow'
      } else if (color === 'BASE_SILVER') {
        return 'bg-silver'
      }else if (color === 'BASE_RED') {
        return 'bg-red'
      }else if (color === 'BASE_BLACK') {
        return 'bg-black'
      }
    },
    setMachineBackground(machine){
      if(machine.mtype === 'RS'){
        return this.setRSandBSColor(machine['rs_ring_color'])
      } else if(machine.mtype === 'BS'){        
        return this.setRSandBSColor(machine['bs_color'])
      }

    }
  }
}
</script>

<style scoped>

figcaption {
  font-size: 12px;
}

.machine-zone{
  color: var(--main-cyan-color)
}
.machine-state-small {
  font-size: 12px;
}

.machine-state-large {
  font-size: 15px;
}

.machine-info {
  line-height: 1 !important;
}

.machine-rotation{
  color: var(--main-cyan-color)
}

.bg-black{
  background-color: black !important;
}
.bg-red{
  background-color: rgb(228, 44, 44) !important;
}
.bg-orange{
  background-color: orangered !important;
}
.bg-green{
  background-color: green;
}
.bg-blue{
  background-color: rgba(0, 0, 255, 0.651) !important;
}
.bg-yellow {
  background-color: rgba(255, 255, 0, 0.685) !important;
}
.bg-silver{
  background-color: silver !important;
}

.rs-color-container {
  width: 20px;
  border-radius: 5px;
}
.station-specific-info-container{
  width: 50px;
  height: 25px;
  border: 1px solid black !important;
}


</style>

