<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="team-a-body col-md-6 border">
        <div class="row">
          <div class="col-md-6 machines-container">
            <BodyMachinesTeamA/>
          </div>

          <div class="col-md-6">
            <div class="row">
              <div class="score-container col-md-12">
                <BodyScoreTeamA />
              </div>
              <div class="robots-container col-md-12">
                <BodyRobotsTeamA />
              </div>
            </div>
          </div>  
          
        </div>
      </div>

      <div class="team-b-body col-md-6">
        <h1>Body B</h1>
      </div>
    </div>
  </div>
</template>

<script>
import BodyMachinesTeamA from './BodyMachinesTeamA'
import BodyScoreTeamA from './BodyScoreTeamA'
import BodyRobotsTeamA from './BodyRobotsTeamA'

export default {
  name: 'Body',
  components: {
    BodyMachinesTeamA,
    BodyScoreTeamA,
    BodyRobotsTeamA
  }
}
</script>

<style>

</style>