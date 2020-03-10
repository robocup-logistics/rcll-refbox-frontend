<template>
  <div >
    <h1 v-if="phase !== 'Pre_Game'">Points: {{scoreCyan}}</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'BodyScoreTeamA',
  computed: {
    ...mapState(['scoreCyan', 'phase'])
  }
}
</script>

<style>

</style>