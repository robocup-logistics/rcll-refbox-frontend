<template>
  <div class="add-points-container">
    <form @submit.prevent="formatAndSendInputToWebsocket(pointsAndReaseon)" class="add-points-form">
      <input type="text" class="p-0 add-points-input" required placeholder="Format: points, reason"
             v-model="pointsAndReaseon"
             ref="addInput"
      >
    </form>
  </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: 'AddPointsManually',
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data(){
    return{
      pointsAndReaseon: ""
    }
  },
  mounted(){
    this.$nextTick(function () {
          this.$refs.addInput.focus()
        })
  },
  methods: {
    ...mapActions(['sendAddPointsTeam']),
    printInput(input){
      console.log(input);
    },
    formatAndSendInputToWebsocket(input){
      console.log(input);
      // Input Format: points, Reason
      const splitInput = input.split(/,(.+)/)
      const points = parseInt(splitInput[0])
      const reason = splitInput[1]
      
      const msg = {
        "command": "add_points_team",
        "points": points,
        "team_color": `${this.color.toUpperCase()}`,
        "game_time": parseFloat(this.$store.state.gametime),
        "phase": `${this.$store.state.phase}`,
        "reason": `${reason}`
      }
      console.log(typeof msg.points);
      this.sendAddPointsTeam(msg)
      this.$parent.toggleShowAddPoints()

    }
  }

}
</script>

<style scoped>
.add-points-container{
  margin: auto !important;
}
.add-points-form{
 border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 1px solid !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2B3E50 !important;
}
.add-points-input{
    border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2B3E50 !important;
  text-align: center !important;
  color: #FFF;
  min-width: 25vw;
}
</style>