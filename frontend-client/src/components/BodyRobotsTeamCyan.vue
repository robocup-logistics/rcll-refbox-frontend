<template>
  <div>
    <div v-if="currentPhase !== 'Pre_game'">
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
            >
              {{setMaintenanceToFalse(index)}}
              {{robotState(index)}}
            </span>
            <span v-else-if="robotState(index) === 'maintenance'" class="text-warning mr-2">
              <span>{{saveMaintenanceStart(gametime,index, 'cyan')}}</span>
                {{robotState(index)}} 
                {{getMaintenanceLeft(robot['maintenance-start-time'], gametime, index)}}
              </span>
            <span v-else-if="robotState(index) === 'disqualified'" class="text-danger mr-2"> 
              {{setMaintenanceToFalse(index)}}
              {{robotState(index)}}!</span>
            <span class="robot-maintenance-cycles" >{{robot['maintenance-cycles']}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'; 

export default {
  name: 'BodyRobotsTeamCyan',
  data(){
    return{
      maintenanceStartTime: [],
      isInMaintenance: [false,false,false,false,false,false]
    }
  },
  computed: {
    ...mapState({
      allCyanRobots: state => state.robots.robotsCyan,
      currentPhase: state => state.phase,
      gametime: state => state.gametime,
      pollRate: state => state.pollRate,
    })
  },

  mounted(){
    this.fetchCyanRobots()
    // this.pollRobotInfo()
  },

  methods: {
    ...mapActions(['fetchCyanRobots']),
    pollRobotInfo() {
      setInterval(this.fetchCyanRobots, this.pollRate)
    },
    // Returns current state of a robot
    robotState(index) {
      return this.allCyanRobots[index].state.toLowerCase()
    },
    // Returns the remaining maintenance time
    getMaintenanceLeft(mntStart, gametime,index){
      let res = (this.maintenanceStartTime[index]+120) - this.gametime;
      return `${res.toString().split('.')[0]}s`
    },
    // Sets the maintenance start
    saveMaintenanceStart(mntStart, index, team){
      if (this.isInMaintenance[index] === false) {
        if (team === 'cyan') {
          this.isInMaintenance[index] = true
          this.maintenanceStartTime[index] = mntStart;
        }else {
          this.isInMaintenance[index+3] = true
          this.maintenanceStartTime[index+3] = mntStart;
        }  
      }
    },
    // Robots is no longer in maintenance
    setMaintenanceToFalse(index){
      this.isInMaintenance[index] = false;
    }
  }
}
</script>

<style scoped>

.robot-number, .robot-team, .robot-name {
  color: var(--main-cyan-color) !important;
}
</style>