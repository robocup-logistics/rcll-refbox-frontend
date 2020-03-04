<template>
  <div>
    <div v-if="currentPhase !== 'Pre-Game'">
      <h1 v-for="robot in allCyanRobots" :key="robot.number">{{robot.number}}.{{robot.name}} of {{ robot.team}}</h1>
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
  },

  methods: {
    ...mapActions(['fetchCyanRobots'])
  }
}
</script>

<style>

</style>