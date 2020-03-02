<template>
  <div>
    <HeaderLogo />
    <div class="container-fluid">
      <div class="general-info row">
        <HeaderTeamAInfo />
        <HeaderCentralInformation />
        <HeaderTeamBInfo />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderLogo from './HeaderLogo'
import HeaderTeamAInfo from './HeaderTeamAInfo'
import HeaderTeamBInfo from './HeaderTeamBInfo'
import HeaderCentralInformation from './HeaderCentralInformation'

export default {
  name: 'Header',
  components: {
    HeaderLogo,
    HeaderTeamAInfo,
    HeaderTeamBInfo,
    HeaderCentralInformation
  }
}
</script>

<style>

</style>