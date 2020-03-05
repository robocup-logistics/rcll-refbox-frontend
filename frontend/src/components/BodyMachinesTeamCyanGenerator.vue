<template>
  <div>
    <div class="row"         >
        <div class="mb-1"
             :class="[index != 6 ? 
             'col-xl-6 col-md-3' : 'col-xl-12 col-md-3',
             machine.mtype+'-station']"
             v-for="(machine,index) in machinesCyan" 
             :key="index" 
        >
          <div class="d-flex align-content-center ml-3">
            <div class="base-image-container mr-1">
                    <figure>
                      <img :src="imageUrl" alt="">
                      <figcaption class="text-center">{{machine.zone}} </figcaption>
                    </figure>
            </div>
            <div class="machine-info d-flex flex-column">
                  <span>{{machine.state}}</span>
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
    this.fetchMachinesCyan();
  },

  methods: {
    ...mapActions({
      fetchMachinesCyan: 'fetchMachinesCyan'
    })
  }
}
</script>

<style scoped>

figcaption {
  font-size: 12px;
}

.machine-info {
  line-height: 1 !important;
}
</style>

