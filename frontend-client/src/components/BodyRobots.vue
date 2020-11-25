<template>
  <div >
    <div >
      <div class="points-container ">
        <h4 v-if="phase !== 'PRE_GAME'">Points: {{selectPointsArray(color)}}</h4>
      </div>
      <div v-for="(robot,index) in selectRobotsArray(color)" 
           :key="robot.number"
           >
        <div class="robot-info d-flex align-items-center">
          <div class="robot-col pl-2">
            <span class="robot-number mr-2 ">{{robot.number}}</span>
            <span class="robot-name mr-3 ">
              <strong> {{robot.name}} </strong>
            </span>
          </div>
          <div class="robot-host  ">
            <span class="robot-host-ip">
              {{robot.host}}
            </span>
          </div>
          <div class="robot-state display-flex align-items-center ">
            <span class="robot-current-state mr-2 text-success"
                  v-if="robotState(index) === 'active'"
            >
              {{setMaintenanceToFalse(index)}}
              {{robotState(index)}}
            </span>
            <span v-else-if="robotState(index) === 'maintenance'" class="text-warning mr-2">
              <span>{{saveMaintenanceStart(gametime,index, color)}}</span>
                {{robotState(index)}} 
                {{getMaintenanceLeft(robot['maintenance-start-time'], gametime, index)}}
              </span>
            <span v-else-if="robotState(index) === 'disqualified'" class="text-danger mr-2"> 
              {{setMaintenanceToFalse(index)}}
              {{robotState(index)}}!</span>
            <span class="robot-maintenance-cycles" >{{robot['maintenance_cylces']}}</span>
            <a class="ml-2 btn" v-if="robotState(index) === 'active'" data-toggle="tooltip" title="Robot maintenance" @click="SetRobotMaintenanceStatus({robot, bool:true})">
              <font-awesome-icon :icon="['fa','robot']" class="fa-1x icon-robots-yellow-active" style="color:green"/>
            </a>
            <a class="ml-2 btn" v-else-if="robotState(index) === 'maintenance'"  data-toggle="tooltip" title="reset maintenance" @click="SetRobotMaintenanceStatus({robot, bool:false})">
              <font-awesome-icon :icon="['fa','robot']" class="fa-1x icon-robots icon-robots-green-maintenance" style="color:yellow" />
            </a>
            <a class="ml-2 btn" style="pointer-events: none;" v-else-if="robotState(index) === 'disqualified'" data-toggle="tooltip" title="Robot disqualified">
              <font-awesome-icon :icon="['fa','robot']" class="fa-1x icon-robots" style="color:red" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions} from 'vuex'; 

export default {
  name: 'BodyRobots',
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data(){
    return{
      maintenanceStartTime: [],
      isInMaintenance: [false,false,false]
    }
  },
  computed: {
    ...mapState({
      allCyanRobots: state => state.robots.robotsCyan,
      allMagentaRobots: state => state.robots.robotsMagenta,
      currentPhase: state => state.phase,
      gametime: state => state.gametime,
      pollRate: state => state.pollRate,
      scoreCyan: state => state.scoreCyan,
      scoreMagenta: state => state.scoreMagenta,
      phase: state => state.phase,

    })
  },
  methods: {
    ...mapActions(["SetRobotMaintenanceStatus"]),
    // Returns current state of a robot
    selectRobotsArray(color){
      if (color === 'cyan') {
        return this.allCyanRobots
      } else {
        return this.allMagentaRobots
      }
    },
    selectPointsArray(teamColor){
      if (teamColor === 'cyan') {
        return this.scoreCyan
      } else {
        return this.scoreMagenta
      }
    },
    robotState(index) {
      if (this.color === 'cyan') {
        return this.allCyanRobots[index].state.toLowerCase()
      } else {
        return this.allMagentaRobots[index].state.toLowerCase()
        
      }
    },
    // Returns the remaining maintenance time
    getMaintenanceLeft(mntStart, gametime,index){
      let res = (this.maintenanceStartTime[index]+120) - this.gametime;
      return `${res.toString().split('.')[0]}s`
    },
    // Sets the maintenance start
    saveMaintenanceStart(mntStart, index){
      if (this.isInMaintenance[index] === false) {
          this.isInMaintenance[index] = true
          this.maintenanceStartTime[index] = mntStart;  
      }
    },
    // Robots is no longer in maintenance
    setMaintenanceToFalse(index){
      if (this.robotState(index) !== 'maintenance') {
          this.isInMaintenance[index] = false;
        }
    },
  }
}
</script>

<style scoped>
.icon-robots-yellow-active:hover{
   color: yellow !important;
}
.icon-robots-green-maintenance:hover{
  color: green !important
}
.robot-number, .robot-team, .robot-name {
  color: var(--main-cyan-color) !important;
}
.points-container{
  border-bottom: 1px #dee2e6 solid !important;
}
.robot-info > * {
  flex: 1  !important;
}
.robot-host-ip{
  text-align: center !important;
  margin: 0 !important;
}
.robot-info > div{
  display: flex !important;
  justify-content: space-around;
}
.robot-col{
  justify-content: flex-start !important;
}
</style>