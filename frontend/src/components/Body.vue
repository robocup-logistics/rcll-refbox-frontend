<template>
  <div class="container-fluid">
    <div class="row ">
      <div class="team-a-body col-md-6 border">
        <div class="row">
          <div class="col-md-4 machines-container p-0">
            <BodyMachinesTeamA/>
          </div>

          <div class="col-md-8 p-0">
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

      <div class="team-b-body col-md-6 border">
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