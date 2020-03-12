<template>
  <div>
    <div class="row m-0 pt-3 ">
        <div class="mb-1 col-xl-12 col-md-3"
             :class="[machine.mtype+'-station']"
             v-for="(machine,index) in machinesCyan" 
             :key="index" 
        >
          <div class="d-flex align-content-center ml-3" >
            <div class="base-image-container mr-1">
                    <figure>
                      <img :src="imageUrl" alt="">
                      <figcaption class="text-center machine-zone">{{machine.zone}}
                        <br>
                        <span v-if="currPhase === 'Setup'">{{machine.rotation}}°</span>
                      </figcaption>
                    </figure>
            </div>
            <div class="machine-info d-flex flex-column">
                  <span :class="setStateClass(machine.state)">
                    {{machine.state}}
                  </span>
                  <div v-if="machine.mtype === 'RS'" class="d-flex my-1">
                    <span>{{machine['bases-added'] - machine['bases-used']}}</span>
                    <div class="ml-2 d-flex">
                      <div 
                        class="rs-color-container mr-1"
                        :class="setRsColor(machine['rs-ring-color'])">
                        <span class="invisible">color</span>
                      </div>
                      <span>{{showPreparedColorInfo(machine['rs-ring-color'])}}</span>
                    </div>
                  </div>
                  <span>{{machine.name}}</span>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  name: 'BodyMachinesTeamCyanGenerator',
  computed: {
    ...mapState({
      machinesCyan: state => state.machines.machinesCyan,
      currPhase: state => state.phase,
      ringspecs: state => state.machines.ringspecs
    })
  },

  data() {
    return {
      imageUrl: 'http://via.placeholder.com/50x25'
    }
  },

  mounted() {
    this.fetchMachinesCyan()
    this.fetchRingSpec()
    this.pollMachineInfo();
  },

  methods: {
    ...mapActions({
      fetchMachinesCyan: 'fetchMachinesCyan',
      fetchRingSpec: 'fetchRingSpec'
    }),
    pollMachineInfo() {
      // Polls Information every 3 seconds
      setInterval(this.fetchMachinesCyan, 1500)
    },
    setStateClass(state) {
      let classList = ''
      // IDLE
      if (state === 'IDLE' || state ==='WAIT-IDLE') {
        classList += 'machine-state-large text-light lead'
      } else if (state === 'BROKEN' || state === 'DOWN'){
        classList += 'machine-state-small text-danger lead '
      }else {
        classList += 'machine-state-small text-warning lead'
      }
      return classList;
    },
    showPreparedColorInfo(ringColor) {
      let reqBases = 0;
      this.ringspecs.forEach((ringspec) => {
        if(ringspec.color === ringColor) {
          reqBases = ringspec['req-bases'];
        }
      });
      return `: ${reqBases}`;
    },
    setRsColor(ringcolor) {
      if (ringcolor === 'RING_BLUE') {
        return 'bg-info'
      } else if (ringcolor === 'RING_ORANGE') {
        return 'bg-primary'
      } else if (ringcolor === 'RING_GREEN') {
        return 'bg-success'
      } else if (ringcolor === 'RING-YELLOW') {
        return 'bg-yellow'
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

.bg-yellow {
  background-color: yellow !important;
}

.rs-color-container {
  width: 40px;
}


</style>

