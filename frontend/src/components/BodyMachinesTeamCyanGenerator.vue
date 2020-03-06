<template>
  <div>
    <div class="row m-0"         >
        <div class="mb-1"
             :class="[index !== 6 ? 
             'col-xl-6 col-md-3' : 'col-xl-12 col-md-3',
             machine.mtype+'-station']"
             v-for="(machine,index) in machinesCyan" 
             :key="index" 
        >
          <div class="d-flex align-content-center ml-3">
            <div class="base-image-container mr-1">
                    <figure>
                      <img :src="imageUrl" alt="">
                      <figcaption class="text-center machine-zone">{{machine.zone}} </figcaption>
                    </figure>
            </div>
            <div class="machine-info d-flex flex-column">
                  <span :class="setStateClass(machine.state)"
                  >{{machine.state}}</span>
                  <span>#boxes</span>
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
      machinesCyan: state => state.machines.machinesCyan
    })
  },

  data() {
    return {
      imageUrl: 'http://via.placeholder.com/50x25'
    }
  },

  mounted() {
    this.fetchMachinesCyan()
    this.pollMachineInfo();
  },

  methods: {
    ...mapActions({
      fetchMachinesCyan: 'fetchMachinesCyan'
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
</style>

