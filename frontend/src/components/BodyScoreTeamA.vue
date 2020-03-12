<template>
  <div >
    <h1 v-if="phase !== 'Pre_game'">Points: {{scoreCyan}}</h1>
    <div class="awarded-points-container">

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'BodyScoreTeamA',
  computed: {
    ...mapState(['scoreCyan', 'phase', 'awardedPoints'])
  },
  mounted() {
    this.fetchAwardedPoints();
    this.pollAwardedPoints();
  },
  methods: {
    ...mapActions(['fetchAwardedPoints']),
    pollAwardedPoints() {
      setInterval(this.fetchAwardedPoints, 1500);
    }
  }
}
</script>

<style>

</style>