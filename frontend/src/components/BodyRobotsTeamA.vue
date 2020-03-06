<template>
  <div>
    <div v-if="currentPhase !== 'Pre-Game'">
      <div v-for="(robot,index) in allCyanRobots" 
           :key="robot.number"
           >
        <div class="robot-col">
          <span class="robot-number mr-2 ">{{robot.number}}</span>
          <span class="robot-name mr-3 ">
            <strong> {{robot.name}} </strong>
          </span>
          <span class="robot-team">
            <strong> ({{robot.team}}) </strong>
          </span>
        </div>
        <div class="robot-info d-flex justify-content-between">
          <div class="robot-host">
            <span class="robot-host-ip">
              {{robot.host}}
            </span>
          </div>
          <div class="robot-state">
            <span class="robot-current-state mr-2 text-success"
                  v-if="robotState(index) === 'active'"
            >{{robotState(index)}}</span>
            <span v-else-if="robotState(index) === 'maintenance'" class="text-warning mr-2">
              {{robotState(index)}}</span>
            <span v-else-if="robotState(index) === 'disqualified'" class="text-danger mr-2"> 
              {{robotState(index)}}!</span>
            <span class="robot-maintnance-cycles" >{{robot['maintenance-cycles']}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'; 

export default {
  name: 'BodyRobotsTeamA',
  computed: {
    ...mapState({
      allCyanRobots: state => state.robots.robotsCyan,
      currentPhase: state => state.phase 
    })
  },

  mounted(){
    this.fetchCyanRobots()
    this.pollRobotInfo()
  },

  methods: {
    ...mapActions(['fetchCyanRobots']),
    pollRobotInfo() {
      setInterval(this.fetchCyanRobots, 1500)
    },
    robotState(index) {
      return this.allCyanRobots[index].state.toLowerCase()
    },
  }
}
</script>

<style>

.robot-number, .robot-team, .robot-name {
  color: var(--main-cyan-color) !important;
}
</style>