<template>
  <div>
    <form @submit.prevent="formatAndSendInputToWebsocket(pointsAndReaseon)">
      <input type="text" class="p-0" required placeholder="Format: points, reason"
             v-model="pointsAndReaseon"
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

<style>

</style>