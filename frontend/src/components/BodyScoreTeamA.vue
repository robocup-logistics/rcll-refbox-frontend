<template>
  <div class="border ">
    <h1>Points: {{scoreCyan}}</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'BodyScoreTeamA',
  computed: {
    ...mapState(['scoreCyan'])
  }
}
</script>

<style>

</style>